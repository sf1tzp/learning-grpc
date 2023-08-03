
import * as grpc from '@grpc/grpc-js';
import { HelloRequest, HelloReply } from '../protobuf/helloworld/helloworld_pb';
import { GreeterClient } from '../protobuf/helloworld/helloworld_grpc_pb';
import { SurfaceCall } from '@grpc/grpc-js/build/src/call';

type User = {
    name: string;
}

if (require.main === module) {
    main();
}

function main() {
    var client = new GreeterClient('localhost:50051', grpc.credentials.createInsecure());
    var user: User = { name: 'Typescript' };

    Hello(client, user);

    return
}

function Hello(client: GreeterClient, user: User) {
    var helloRequest = new HelloRequest();
    helloRequest.setName(user.name);

    client.sayHello(helloRequest, function (err: grpc.ServiceError, response: HelloReply) {
        if (err !== null) {
            console.log('Error: ', err.message);
            return
        }
        console.log("In hello: ", response.getMessage());
        return
    });
}
