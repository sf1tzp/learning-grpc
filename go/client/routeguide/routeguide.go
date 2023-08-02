package routeguide

import (
	"context"
	"io"
	"log"

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

func (c *RouteGuideClient) GetFeature(ctx context.Context, point *Point) (string, error) {
	feature, err := c.client.GetFeature(ctx, point.unWrap())
	if err != nil {
		return "", err
	}
	return feature.GetName(), nil
}

func (c *RouteGuideClient) GetRouteDistance(ctx context.Context, points []Point) (int32, error) {
	stream, err := c.client.RecordRoute(ctx)
	if err != nil {
		return 0, err
	}

	for _, p := range points {
		point := p.unWrap()
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

func (c *RouteGuideClient) ListFeatures(ctx context.Context, area Area) ([]string, error) {
	var features []string
	stream, err := c.client.ListFeatures(ctx, area.unWrap())
	if err != nil {
		return nil, err
	}

	for {
		feature, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}
		features = append(features, feature.GetName())
	}
	return features, nil
}

func (c *RouteGuideClient) RouteChat(ctx context.Context, notes []Note) error {
	log.Println("Starting Stream")
	stream, err := c.client.RouteChat(ctx)
	if err != nil {
		return err
	}

	wait := make(chan struct{})
	go func() error {
		for {
			in, err := stream.Recv()
			if err == io.EOF {
				close(wait)
				log.Println("Stream ended")
				return nil
			}
			if err != nil {
				return err
			}
			log.Printf("Info: Received Note for %s: %s", in.GetName(), in.GetMessage())
		}
	}()

	for _, n := range notes {
		note := n.unWrap()
		err := stream.Send(note)
		if err != nil {
			log.Printf("Error: %v", err)
		}
	}

	stream.CloseSend()
	<-wait

	return nil
}
