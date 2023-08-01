package routeguide

import (
	"context"

	rg "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"
	"google.golang.org/grpc"
)

type RouteGuideClient struct {
	client rg.RouteGuideClient
}

func NewRouteGuideClient(connection *grpc.ClientConn) RouteGuideClient {
	return RouteGuideClient{
		client: rg.NewRouteGuideClient(connection),
	}
}

func (c *RouteGuideClient) GetFeature(ctx context.Context, lat int32, long int32) (string, error) {
	point := &rg.Point{
		Latitude:  lat,
		Longitude: long,
	}
	feature, err := c.client.GetFeature(ctx, point)
	if err != nil {
		return "", err
	}
	return feature.GetName(), nil
}
