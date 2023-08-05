import * as async from 'async'
import * as grpc from '@grpc/grpc-js'
import { delay, random } from 'lodash'
import { HelloRequest, HelloReply } from '../protobuf/helloworld/helloworld_pb'
import { GreeterClient } from '../protobuf/helloworld/helloworld_grpc_pb'

import { Point, Rectangle, Feature, RouteNote} from '../protobuf/routeguide/routeguide_pb'
import { RouteGuideClient } from '../protobuf/routeguide/routeguide_grpc_pb'

type User = {
    name: string
}

class Coordinate {
    point: Point = new Point()
    constructor(latitude: number, longitude: number) {
        this.point.setLatitude(latitude)
        this.point.setLongitude(longitude)
    }
    toString() {
        return "(" + this.point.getLatitude() + "," + this.point.getLongitude() + ")"
    }
}

class SearchArea {
    rectangle: Rectangle = new Rectangle()
    constructor(topLeft: Coordinate, bottomRight: Coordinate) {
        this.rectangle.setTopleft(topLeft.point)
        this.rectangle.setBottomright(bottomRight.point)
    }
}

if (require.main === module) {
    main()
}

function main() {
    callHelloAPIs()

    var routeClient = new RouteGuideClient('localhost:50051', grpc.credentials.createInsecure())
    var stl: Coordinate = new Coordinate(38.6270,-90.19940)

    GetFeatureAt(routeClient, stl)

    var topLeft: Coordinate = new Coordinate(50.030520, -126.800328)
    var bottomRight: Coordinate = new Coordinate(20.104646,  -75.219728)
    var searchArea: SearchArea = new SearchArea(topLeft, bottomRight)

    GetFeaturesIn(routeClient, searchArea)

    var coords: Coordinate[] = [
        new Coordinate(38.6270,-90.19940),
        new Coordinate(39.7392,-104.9903),
        new Coordinate(32.7157,-117.1611),
        new Coordinate(37.7749,-122.4194),
        new Coordinate(44.0570,-123.0869)
    ]

    getRouteDistance(routeClient, coords)

    return
}

async function callHelloAPIs() {
    var helloClient = new GreeterClient('localhost:50051', grpc.credentials.createInsecure())
    var user: User = { name: 'Typescript' }

    // Here we call Hello asynchronously - a branch is called when the promise is resolved
    Hello(helloClient, user)
        .then((message) => {
            console.log("Eventually got response: ", message)
        })
        .catch((err) => {
            helloClient.close()
            console.log("Eventually got error: ", err)
        })

    // Synchronous Usage - Here we block with 'await' until the promise resolves
    var message = await Hello(helloClient, user)
        .catch((err) => {
            helloClient.close()
            console.log("Waited for error: ", err)
        })

    if (message !== undefined) {
        console.log("Waited for message: ", message)
    }
}

function Hello(client: GreeterClient, user: User): Promise<string> {
    var helloRequest = new HelloRequest()
    helloRequest.setName(user.name)

    return new Promise<string>((resolve, reject) => {
        client.sayHello(helloRequest, function (err: grpc.ServiceError, response: HelloReply) {
            if (err !== null) {
                return reject(err.message)
            } else {
                return resolve(response.getMessage())
            }
        })
    })
}

// Route Guide APIs
function GetFeatureAt(client: RouteGuideClient, coord: Coordinate) {
    var foo = client.getFeature(coord.point, function (err: grpc.ServiceError, response: Feature) {
        if (err !== null) {
            console.log('Error: ', err.message)
            client.close()
        } else {
            console.log("Feature at: " + coord.toString() + " is " + response.getName())
        }
    })
}

function GetFeaturesIn(client: RouteGuideClient, area: SearchArea) {
    var call: grpc.ClientReadableStream<Feature> = client.listFeatures(area.rectangle)

    call.on("data", (chunk: Feature) => {
        var name = chunk.getName()
        var location = new Coordinate(chunk.getLocation().getLatitude(), chunk.getLocation().getLongitude())
        console.log(name + " at " + location.toString())
    })

    call.on("error", (error: grpc.ServiceError) => {
        console.log("Error: ", error.message)
        client.close()
    })

    call.on("close", () => console.log("Stream ended"))
}

function getRouteDistance(client: RouteGuideClient, coords: Coordinate[]) {
    var call = client.recordRoute(function (error, response) {
        if (error) {
            console.log('Error: ', error.message)
            return
        } else {
            console.log("Route Distance: ", response.getDistance())
        }
    })

    function requestBuilder(coord: Coordinate) {
        return function(callback) {
            call.write(coord.point)
            delay(callback, random(50, 100))
        }
    }

    var requests = []
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i]
        requests[i] = requestBuilder(coord)
    }

    async.series(requests, () => call.end())
}
