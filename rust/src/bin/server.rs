use anyhow::{Result, anyhow};
use tonic::{transport::Server, Request, Response, Status};

use learning_grpc::protobuf::routeguide::{route_guide_server::{RouteGuide, RouteGuideServer}, Point, Feature};

#[derive(Debug, Default)]
pub struct RouteServer {}

#[tonic::async_trait]
impl RouteGuide for RouteServer {
    async fn get_feature(&self, request: Request<Point>) -> Result<Response<Feature>, Status> {
        println!("Received request {:?}", request);
        let (metadata, extensions, point) = request.into_parts();
        println!("Point {:?}", point);

        let response = Response::new(Feature {
            location: Some(Point {latitude: point.latitude, longitude: point.longitude}),
            name: "Earth".into(),
        });

        Ok(response)
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let address = match "0.0.0.0:50052".parse() {
        Ok(a) => a,
        Err(e) => return Err(anyhow!("Could not parse address {e}"))
    };
    let route_server = RouteServer::default();

    Server::builder()
        .add_service(RouteGuideServer::new(route_server))
        .serve(address)
        .await?;
    Ok(())
}