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
const grpc = __importStar(require("@grpc/grpc-js"));
const helloworld_pb_1 = require("../protobuf/helloworld/helloworld_pb");
const helloworld_grpc_pb_1 = require("../protobuf/helloworld/helloworld_grpc_pb");
if (require.main === module) {
    main();
}
function main() {
    var client = new helloworld_grpc_pb_1.GreeterClient('localhost:50051', grpc.credentials.createInsecure());
    var user = { name: 'Typescript' };
    var message = greet(client, user);
    console.log('Greetings 1: ', message); // FIXME: See why this appears first in the log
    return;
}
async function greet(client, user) {
    var helloRequest = new helloworld_pb_1.HelloRequest();
    helloRequest.setName(user.name);
    // FIXME: Learn how to capture this return value
    var message = '';
    await client.sayHello(helloRequest, function (err, response) {
        if (err !== null) {
            console.log('Error: %s', err.message);
            return;
        }
        message = response.getMessage();
        console.log("Greetings 2: ", message);
    });
    // FIXME: message is not set here
    return message;
}
//# sourceMappingURL=client.js.map