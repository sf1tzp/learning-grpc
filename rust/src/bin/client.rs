use anyhow::{anyhow, Result};

use learning_grpc::protobuf::helloworld::greeter_client::GreeterClient;
use learning_grpc::protobuf::helloworld::HelloRequest;

#[tokio::main]
async fn main() -> Result<()> {
    // TODO: Add argument parsing
    let mut client = match GreeterClient::connect("http://localhost:50051").await {
        Ok(client) => client,
        Err(e) => return Err(anyhow!("Error: {e}")),
    };

    let request = HelloRequest {
        name: "Ferris 🦀".into(),
    };

    match client.say_hello(request.clone()).await {
        Ok(response) => {
            let response = response.into_inner();
            let message = response.message;
            println!("Greetings: {message}");
        }
        Err(e) => return Err(anyhow!("Error: {e}")),
    };

    match client.say_hello_again(request.clone()).await {
        Ok(response) => {
            let response = response.into_inner();
            let message = response.message;
            println!("Greetings: {message}");
        }
        Err(e) => return Err(anyhow!("Error: {e}")),
    };

    Ok(())
}
