use anyhow::{anyhow, Result};
use tokio_stream::wrappers::ReceiverStream;
use tonic::{transport::Server, Request, Response, Status, Streaming};

use learning_grpc::protobuf::routeguide::{
    route_guide_server::{RouteGuide, RouteGuideServer},
    Feature, Point, Rectangle, RouteSummary,
};

#[derive(Debug, Default)]
pub struct RouteServer {}

#[tonic::async_trait]
impl RouteGuide for RouteServer {
    async fn get_feature(&self, request: Request<Point>) -> Result<Response<Feature>, Status> {
        let (metadata, extensions, point) = request.into_parts();
        println!("Received request {:?}", metadata);
        println!("{:?}", point);

        let response = Response::new(Feature {
            location: Some(Point {
                latitude: point.latitude,
                longitude: point.longitude,
            }),
            name: "Earth".into(),
        });

        Ok(response)
    }

    async fn record_route(
        &self,
        request: Request<Streaming<Point>>,
    ) -> Result<Response<RouteSummary>, Status> {
        unimplemented!()
    }

    type ListFeaturesStream = ReceiverStream<Result<Feature, Status>>;
    async fn list_features(
        &self,
        request: Request<Rectangle>,
    ) -> Result<Response<Self::ListFeaturesStream>, Status> {
        unimplemented!()
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let address = match "0.0.0.0:50052".parse() {
        Ok(a) => a,
        Err(e) => return Err(anyhow!("Could not parse address {e}")),
    };
    let route_server = RouteServer::default();

    Server::builder()
        .add_service(RouteGuideServer::new(route_server))
        .serve(address)
        .await?;
    Ok(())
}
