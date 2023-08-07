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
// Use a new classes for convenient constructors and to override toString()
class Coordinate extends routeguide_pb_1.Point {
    constructor(latitude, longitude) {
        super();
        this.setLatitude(latitude);
        this.setLongitude(longitude);
    }
    toString() {
        return "(" + this.getLatitude() + "," + this.getLongitude() + ")";
    }
}
class SearchArea extends routeguide_pb_1.Rectangle {
    constructor(topLeft, bottomRight) {
        super();
        this.setTopleft(topLeft);
        this.setBottomright(bottomRight);
    }
}
if (require.main === module) {
    main();
}
function main() {
    callHelloAPIs();
    callRouteGuideAPIs();
}
async function callHelloAPIs() {
    var helloClient = new helloworld_grpc_pb_1.GreeterClient('localhost:50051', grpc.credentials.createInsecure());
    var user = { name: 'Typescript' };
    // Here we call Hello asynchronously - a branch is called when the promise is resolved
    Hello(helloClient, user)
        .then((message) => {
        console.log("Eventually got response: ", message);
    })
        .catch((err) => {
        helloClient.close();
        console.log("Eventually got error: ", err.message);
    });
    // Synchronous Usage - Here we block with 'await' until the promise resolves
    var message = await Hello(helloClient, user)
        .catch((err) => {
        helloClient.close();
        console.log("Waited for error: ", err.message);
    });
    if (message !== undefined) {
        console.log("Waited for message: ", message);
    }
}
function Hello(client, user) {
    var helloRequest = new helloworld_pb_1.HelloRequest();
    helloRequest.setName(user.name);
    return new Promise((resolve, reject) => {
        client.sayHello(helloRequest, function (err, response) {
            if (err !== null) {
                return reject(err);
            }
            else {
                return resolve(response.getMessage());
            }
        });
    });
}
function callRouteGuideAPIs() {
    var routeClient = new routeguide_grpc_pb_1.RouteGuideClient('localhost:50051', grpc.credentials.createInsecure());
    var stl = new Coordinate(38.6270, -90.19940);
    getFeatureAt(routeClient, stl)
        .then((feature) => {
        let name = feature.getName();
        let location = feature.getLocation();
        // FIXME: Why doesn't this use Coordinate's toString()?
        // console.log("Feature at: " + location.toString() + " is " + name)
        let coord = new Coordinate(location.getLatitude(), location.getLongitude());
        console.log("Feature at:", coord.toString(), "is", name);
    })
        .catch((err) => {
        console.log("Could not get feature: ", err.message);
    });
    var topLeft = new Coordinate(50.030520, -126.800328);
    var bottomRight = new Coordinate(20.104646, -75.219728);
    var searchArea = new SearchArea(topLeft, bottomRight);
    getFeaturesIn(routeClient, searchArea)
        .then((features) => {
        for (var i = 0; i < features.length; i++) {
            let feature = features[i];
            let name = feature.getName();
            let location = feature.getLocation();
            let coord = new Coordinate(location.getLatitude(), location.getLongitude());
            console.log("Found feature", name, "at", coord.toString());
        }
    })
        .catch((err) => {
        console.log("Could not list features: ", err.message);
    });
    var coords = [
        new Coordinate(38.6270, -90.19940),
        new Coordinate(39.7392, -104.9903),
        new Coordinate(32.7157, -117.1611),
        new Coordinate(37.7749, -122.4194),
        new Coordinate(44.0570, -123.0869)
    ];
    getRouteDistance(routeClient, coords)
        .then((distance) => {
        console.log("Route distance:", distance);
    })
        .catch((err) => {
        console.log("Could not get route distance: ", err.message);
    });
    getFeatureNotes(routeClient, ["Saint Louis", "Las Vegas", "Seattle"])
        .then((notes) => {
        for (const [name, messages] of notes) {
            console.log("Notes about " + name + ":");
            for (var i = 0; i < messages.length; i++) {
                console.log(messages[i]);
            }
        }
    })
        .catch((err) => {
        console.log("Could not get feature notes: ", err.message);
    });
}
// Route Guide APIs
function getFeatureAt(client, coord) {
    return new Promise((resolve, reject) => {
        client.getFeature(coord, function (err, response) {
            if (err !== null) {
                return reject(err);
            }
            else {
                return resolve(response);
            }
        });
    });
}
function getFeaturesIn(client, area) {
    return new Promise((resolve, reject) => {
        var features = [];
        var call = client.listFeatures(area);
        call.on("data", (chunk) => {
            features.push(chunk);
        });
        call.on("error", (error) => {
            client.close();
            return reject(error);
        });
        call.on("close", () => {
            return resolve(features);
        });
    });
}
function getRouteDistance(client, coords) {
    return new Promise((resolve, reject) => {
        var call = client.recordRoute(function (error, response) {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(response.getDistance());
            }
        });
        function requestBuilder(coord) {
            return function (callback) {
                call.write(coord);
                (0, lodash_1.delay)(callback, (0, lodash_1.random)(50, 100));
            };
        }
        var requests = [];
        for (var i = 0; i < coords.length; i++) {
            var coord = coords[i];
            requests[i] = requestBuilder(coord);
        }
        async.series(requests, () => call.end());
    });
}
function getFeatureNotes(client, feature_names) {
    return new Promise((resolve, reject) => {
        var notes = new Map();
        var call = client.routeChat();
        for (var i = 0; i < feature_names.length; i++) {
            let name = feature_names[i];
            let routeNote = new routeguide_pb_1.RouteNote();
            routeNote.setName(name);
            call.write(routeNote);
        }
        call.end();
        call.on("data", (chunk) => {
            if (chunk.getRoutenote()) {
                let note = chunk.getRoutenote();
                let name = note.getName();
                let message = note.getMessage();
                if (!notes.has(name)) {
                    notes.set(name, []); // Initialize an empty array
                }
                notes.get(name).push(message);
            }
            if (chunk.getError()) {
                let error = chunk.getError();
                console.log("Error getting notes:", error.getMessage());
            }
        });
        call.on("close", () => {
            return resolve(notes);
        });
        call.on("error", (error) => {
            return reject(error);
        });
    });
}
//# sourceMappingURL=client.js.map