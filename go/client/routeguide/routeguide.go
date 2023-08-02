package routeguide

import (
	"context"
	"io"
	"log"

	pb "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"
	"google.golang.org/grpc"
	"google.golang.org/grpc/status"
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
	feature, err := c.client.GetFeature(ctx, point.unwrap())
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
		point := p.unwrap()
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
	stream, err := c.client.ListFeatures(ctx, area.unwrap())
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
	log.Println("Info: Starting Stream")
	stream, err := c.client.RouteChat(ctx)
	if err != nil {
		return err
	}

	wait := make(chan struct{})
	go func() {
		for {
			response, err := stream.Recv()
			if err == io.EOF {
				close(wait)
				log.Println("Info: Stream ended")
				return
			}
			if err != nil {
				log.Printf("Error: Stream error: %v", err)
				return
			}

			// Handle returned errors
			if response.GetError() != nil {
				err := status.FromProto(response.GetError())
				log.Printf("Error: %s, Code %s. Request: %v", err.Message(), err.Code(), err.Details())
			}

			// Handle normal responses
			if response.GetRouteNote() != nil {
				note := response.GetRouteNote()
				log.Printf("Info: Note about %s for %v", note.Name, note.Message)
			}
		}
	}()

	for _, n := range notes {
		note := n.unwrap()
		log.Printf("Info: Sending Note: %v", note)
		err := stream.Send(note)
		if err != nil {
			log.Printf("Error: Stream error: %v", err)
		}
	}

	stream.CloseSend()
	<-wait

	return nil
}
