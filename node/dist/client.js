"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const async = __importStar(require("async"));
const grpc = __importStar(require("@grpc/grpc-js"));
const lodash_1 = require("lodash");
const helloworld_pb_1 = require("../protobuf/helloworld/helloworld_pb");
const helloworld_grpc_pb_1 = require("../protobuf/helloworld/helloworld_grpc_pb");
const routeguide_pb_1 = require("../protobuf/routeguide/routeguide_pb");
const routeguide_grpc_pb_1 = require("../protobuf/routeguide/routeguide_grpc_pb");
class Coordinate {
    point = new routeguide_pb_1.Point();
    constructor(latitude, longitude) {
        this.point.setLatitude(latitude);
        this.point.setLongitude(longitude);
    }
    toString() {
        return "(" + this.point.getLatitude() + "," + this.point.getLongitude() + ")";
    }
}
class SearchArea {
    area = new routeguide_pb_1.Rectangle();
    constructor(topLeft, bottomRight) {
        this.area.setTopleft(topLeft.point);
        this.area.setBottomright(bottomRight.point);
    }
}
if (require.main === module) {
    main();
}
function main() {
    var helloClient = new helloworld_grpc_pb_1.GreeterClient('localhost:50051', grpc.credentials.createInsecure());
    var user = { name: 'Typescript' };
    Hello(helloClient, user);
    var routeClient = new routeguide_grpc_pb_1.RouteGuideClient('localhost:50051', grpc.credentials.createInsecure());
    var stl = new Coordinate(38.6270, -90.19940);
    GetFeatureAt(routeClient, stl);
    var topLeft = new Coordinate(50.030520, -126.800328);
    var bottomRight = new Coordinate(20.104646, -75.219728);
    var searchArea = new SearchArea(topLeft, bottomRight);
    GetFeaturesIn(routeClient, searchArea);
    var coords = [
        new Coordinate(38.6270, -90.19940),
        new Coordinate(39.7392, -104.9903),
        new Coordinate(32.7157, -117.1611),
        new Coordinate(37.7749, -122.4194),
        new Coordinate(44.0570, -123.0869)
    ];
    getRouteDistance(routeClient, coords);
    return;
}
function Hello(client, user) {
    var helloRequest = new helloworld_pb_1.HelloRequest();
    helloRequest.setName(user.name);
    client.sayHello(helloRequest, function (err, response) {
        if (err !== null) {
            console.log('Error: ', err.message);
            client.close();
        }
        else {
            console.log("In hello: ", response.getMessage());
        }
    });
}
function GetFeatureAt(client, coord) {
    var foo = client.getFeature(coord.point, function (err, response) {
        if (err !== null) {
            console.log('Error: ', err.message);
            client.close();
        }
        else {
            console.log("Feature at: " + coord.toString() + " is " + response.getName());
        }
    });
}
function GetFeaturesIn(client, area) {
    var call = client.listFeatures(area.area);
    call.on("data", (chunk) => {
        var name = chunk.getName();
        var location = new Coordinate(chunk.getLocation().getLatitude(), chunk.getLocation().getLongitude());
        console.log(name + " at " + location.toString());
    });
    call.on("error", (error) => {
        console.log("Error: ", error.message);
        client.close();
    });
    call.on("close", () => console.log("Stream ended"));
}
function getRouteDistance(client, coords) {
    var call = client.recordRoute(function (error, response) {
        if (error) {
            console.log('Error: ', error.message);
            return;
        }
        else {
            console.log("Route Distance: ", response.getDistance());
        }
    });
    function requestBuilder(coord) {
        return function (callback) {
            call.write(coord.point);
            (0, lodash_1.delay)(callback, (0, lodash_1.random)(50, 100));
        };
    }
    var requests = [];
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i];
        requests[i] = requestBuilder(coord);
    }
    async.series(requests, () => call.end());
}
//# sourceMappingURL=client.js.map