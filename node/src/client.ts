
import * as grpc from '@grpc/grpc-js';
import { HelloRequest, HelloReply } from '../protobuf/helloworld/helloworld_pb';
import { GreeterClient } from '../protobuf/helloworld/helloworld_grpc_pb';

type User = {
    name: string;
}

if (require.main === module) {
    main();
}

function main() {
    var client = new GreeterClient('localhost:50051', grpc.credentials.createInsecure());
    var user: User = { name: 'Typescript' };

    var message = greet(client, user);

    console.log('Greetings 1: ', message); // FIXME: See why this appears first in the log
    return
}

async function greet(client: any, user: User): Promise<string> {
    var helloRequest = new HelloRequest();
    helloRequest.setName(user.name);

    // FIXME: Learn how to capture this return value
    var message: string = '';
    await client.sayHello(helloRequest, function (err: grpc.ServiceError, response: HelloReply) {
        if (err !== null) {
            console.log('Error: %s', err.message)
            return
        }
        message = response.getMessage();
        console.log("Greetings 2: ", message);
    });

    // FIXME: message is not set here
    return message;
}

