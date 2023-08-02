use std::collections::VecDeque;
use std::error::Error;

use tonic::transport::Channel;
use tonic::Request;

use anyhow::{anyhow, Result};

use learning_grpc::hello_world::greeter_client::GreeterClient;
use learning_grpc::hello_world::HelloRequest;

use learning_grpc::route_guide::route_guide_client::RouteGuideClient;
use learning_grpc::route_guide::{Point, RouteNote};

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

    let mut client = match RouteGuideClient::connect("http://localhost:50051").await {
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

    match run_route_chat(&mut client).await {
        Ok(_) => println!("Run chat ended successfully"),
        Err(e) => return Err(anyhow!("Error: {e}")),
    }

    Ok(())
}

async fn run_route_chat(client: &mut RouteGuideClient<Channel>) -> Result<(), Box<dyn Error>> {
    let mut notes = VecDeque::from([
        RouteNote {
            name: "Saint Louis".to_string(),
            location: None,
            message: "".to_string(),
        },
        RouteNote {
            name: "Las Vegas".to_string(),
            location: None,
            message: "".to_string(),
        },
        RouteNote {
            name: "Portland".to_string(),
            location: Some(Point {
                latitude: 45.514525,
                longitude: -122.668346,
            }),
            message: "".to_string(),
        },
        RouteNote {
            name: "Portland".to_string(),
            location: None,
            message: "".to_string(),
        },
        RouteNote {
            name: "Portland".to_string(),
            location: Some(Point {
                latitude: 45.514525,
                longitude: -122.668346,
            }),
            message: "PORTLANDIA!".to_string(),
        },
        RouteNote {
            name: "Portland".to_string(),
            location: None,
            message: "".to_string(),
        }
    ]);

    let request_stream = async_stream::stream! {
        while let Some(note) = notes.pop_front() {
            yield note;
        }
    };

    let response_stream = client.route_chat(Request::new(request_stream)).await?;
    let mut inbound = response_stream.into_inner();

    while let Some(response) = inbound.message().await? {
        println!("Note = {:?}", response)
    }

    Ok(())
}
