package routeguide

import (
	"context"

	pb "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"
	"google.golang.org/grpc"
)

type RouteGuideClient struct {
	client pb.RouteGuideClient
}

func NewRouteGuideClient(connection *grpc.ClientConn) RouteGuideClient {
	return RouteGuideClient{
		client: pb.NewRouteGuideClient(connection),
	}
}

func (c *RouteGuideClient) GetFeature(ctx context.Context, lat float64, long float64) (string, error) {
	point := &pb.Point{
		Latitude:  lat,
		Longitude: long,
	}
	feature, err := c.client.GetFeature(ctx, point)
	if err != nil {
		return "", err
	}
	return feature.GetName(), nil
}

func (c *RouteGuideClient) GetRouteDistance(ctx context.Context, points []struct {
	Latitude  float64
	Longitude float64
}) (int32, error) {
	stream, err := c.client.RecordRoute(ctx)
	if err != nil {
		return 0, err
	}

	for _, p := range points {
		point := &pb.Point{
			Latitude:  p.Latitude,
			Longitude: p.Longitude,
		}
		if err := stream.Send(point); err != nil {
			return 0, err
		}
	}

	response, err := stream.CloseAndRecv()
	if err != nil {
		return 0, err
	}
	return response.Distance, nil
}
