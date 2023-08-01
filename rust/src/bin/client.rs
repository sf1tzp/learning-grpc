use anyhow::{anyhow, Result};

use learning_grpc::protobuf::helloworld::greeter_client::GreeterClient;
use learning_grpc::protobuf::helloworld::HelloRequest;

use learning_grpc::protobuf::routeguide::route_guide_client::RouteGuideClient;
use learning_grpc::protobuf::routeguide::Point;

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

    let mut client = match RouteGuideClient::connect("http://localhost:50052").await {
        Ok(client) => client,
        Err(e) => return Err(anyhow!("Error {e}")),
    };

    let request = Point {
        latitude: 1.0,
        longitude: 1.0,
    };

    match client.get_feature(request).await {
        Ok(response) => {
            let response = response.into_inner();
            let message = response.name;
            println!("Feature: {message}");
        }
        Err(e) => return Err(anyhow!("Error: {e}")),
    }

    Ok(())
}
