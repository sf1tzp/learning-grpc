import * as async from 'async'
import * as grpc from '@grpc/grpc-js'
import { delay, random } from 'lodash'
import { HelloRequest, HelloReply } from '../protobuf/helloworld/helloworld_pb'
import { GreeterClient } from '../protobuf/helloworld/helloworld_grpc_pb'

import { Point, Rectangle, Feature, RouteNote, RouteSummary, RouteNoteResponse} from '../protobuf/routeguide/routeguide_pb'
import { RouteGuideClient } from '../protobuf/routeguide/routeguide_grpc_pb'
import { mapUriDefaultScheme } from '@grpc/grpc-js/build/src/resolver'

type User = {
    name: string
}

// Use a new classes for convenient constructors and to override toString()
class Coordinate extends Point {
    constructor(latitude: number, longitude: number) {
        super()
        this.setLatitude(latitude)
        this.setLongitude(longitude)
    }
    toString() {
        return "(" + this.getLatitude() + "," + this.getLongitude() + ")"
    }
}

class SearchArea extends Rectangle {
    constructor(topLeft: Coordinate, bottomRight: Coordinate) {
        super()
        this.setTopleft(topLeft)
        this.setBottomright(bottomRight)
    }
}

if (require.main === module) {
    main()
}

function main() {
    callHelloAPIs()

    callRouteGuideAPIs()
}

async function callHelloAPIs() {
    var helloClient = new GreeterClient('localhost:50051', grpc.credentials.createInsecure())
    var user: User = { name: 'Typescript' }

    // Here we call Hello asynchronously - a branch is called when the promise is resolved
    Hello(helloClient, user)
        .then((message: string) => {
            console.log("Eventually got response: ", message)
        })
        .catch((err: grpc.ServiceError) => {
            helloClient.close()
            console.log("Eventually got error: ", err.message)
        })

    // Synchronous Usage - Here we block with 'await' until the promise resolves
    var message = await Hello(helloClient, user)
        .catch((err: grpc.ServiceError) => {
            helloClient.close()
            console.log("Waited for error: ", err.message)
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
                return reject(err)
            } else {
                return resolve(response.getMessage())
            }
        })
    })
}

function callRouteGuideAPIs() {
    var routeClient = new RouteGuideClient('localhost:50051', grpc.credentials.createInsecure())
    var stl: Coordinate = new Coordinate(38.6270,-90.19940)

    getFeatureAt(routeClient, stl)
        .then((feature: Feature) => {
            let name = feature.getName()
            let location = feature.getLocation() as Coordinate
            // FIXME: Why doesn't this use Coordinate's toString()?
            // console.log("Feature at: " + location.toString() + " is " + name)
            let coord = new Coordinate(
                location.getLatitude(),
                location.getLongitude()
            )
            console.log("Feature at:", coord.toString(), "is", name)
        })
        .catch((err: grpc.ServiceError) => {
            console.log("Could not get feature: ",  err.message)
        })

    var topLeft: Coordinate = new Coordinate(50.030520, -126.800328)
    var bottomRight: Coordinate = new Coordinate(20.104646,  -75.219728)
    var searchArea: SearchArea = new SearchArea(topLeft, bottomRight)

    getFeaturesIn(routeClient, searchArea)
        .then((features: Feature[]) => {
            for (var i = 0; i < features.length; i++ ) {
                let feature = features[i]
                let name = feature.getName()
                let location = feature.getLocation()
                let coord = new Coordinate(location.getLatitude(), location.getLongitude())
                console.log("Found feature", name, "at", coord.toString())
            }
        })
        .catch((err: grpc.ServiceError) => {
            console.log("Could not list features: ",  err.message)
        })

    var coords: Coordinate[] = [
        new Coordinate(38.6270,-90.19940),
        new Coordinate(39.7392,-104.9903),
        new Coordinate(32.7157,-117.1611),
        new Coordinate(37.7749,-122.4194),
        new Coordinate(44.0570,-123.0869)
    ]

    getRouteDistance(routeClient, coords)
        .then((distance: number) => {
            console.log("Route distance:", distance)
        })
        .catch((err: grpc.ServiceError) => {
            console.log("Could not get route distance: ",  err.message)
        })

    getFeatureNotes(routeClient, ["Saint Louis", "Las Vegas", "Seattle"])
        .then((notes: Map<string, string[]>) => {
            for (const [name, messages] of notes) {
                console.log("Notes about " + name + ":")
                for (var i = 0; i < messages.length; i++) {
                    console.log(messages[i])
                }
            }
        })
        .catch((err: grpc.ServiceError) => {
            console.log("Could not get feature notes: ",  err.message)
        })
}

// Route Guide APIs
function getFeatureAt(client: RouteGuideClient, coord: Coordinate): Promise<Feature> {
    return new Promise<Feature>((resolve, reject) => {
        client.getFeature(coord, function (err: grpc.ServiceError, response: Feature) {
            if (err !== null) {
                return reject(err)
            } else {
                return resolve(response)
            }
        })
    })
}

function getFeaturesIn(client: RouteGuideClient, area: SearchArea): Promise<Feature[]> {
    return new Promise<Feature[]>((resolve, reject) => {
        var features: Feature[] = []
        var call: grpc.ClientReadableStream<Feature> = client.listFeatures(area)
        call.on("data", (chunk: Feature) => {
            features.push(chunk)
        })

        call.on("error", (error: grpc.ServiceError) => {
            client.close()
            return reject(error)
        })

        call.on("close", () => {
            return resolve(features)
        })
    })
}

function getRouteDistance(client: RouteGuideClient, coords: Coordinate[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        var call = client.recordRoute(function (error: grpc.ServiceError, response: RouteSummary) {
            if (error) {
                return reject(error)
            } else {
                return resolve(response.getDistance())
            }
        })

        function requestBuilder(coord: Coordinate) {
            return function(callback) {
                call.write(coord)
                delay(callback, random(50, 100))
            }
        }

        var requests = []
        for (var i = 0; i < coords.length; i++) {
            var coord = coords[i]
            requests[i] = requestBuilder(coord)
        }

        async.series(requests, () => call.end())
    })
}

function getFeatureNotes(client: RouteGuideClient, feature_names: string[]): Promise<Map<string, string[]>> {
    return new Promise((resolve, reject) => {
        var notes = new Map<string, string[]>()
        var call = client.routeChat()

        for (var i = 0; i < feature_names.length; i++ ) {
            let name = feature_names[i]
            let routeNote = new RouteNote()
            routeNote.setName(name)
            call.write(routeNote)
        }
        call.end()

        call.on("data", (chunk: RouteNoteResponse) => {
            if (chunk.getRoutenote()) {
                let note = chunk.getRoutenote()
                let name = note.getName()
                let message = note.getMessage()
                if (!notes.has(name)) {
                    notes.set(name, []) // Initialize an empty array
                }
                notes.get(name).push(message)
            }
            if (chunk.getError()) {
                let error = chunk.getError()
                console.log("Error getting notes:", error.getMessage())
            }
        })
        call.on("close", () => {
            return resolve(notes)
        })
        call.on("error", (error: grpc.ServiceError) => {
            return reject(error)
        })

    })
}
