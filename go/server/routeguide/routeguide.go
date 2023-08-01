package routeguide

import (
	"context"
	"io"
	"log"
	"time"

	pb "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"
	util "github.com/sf1tzp/learning-grpc/go/server/routeguide/util"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedRouteGuideServer
}

func RegisterServer(s *grpc.Server) {
	pb.RegisterRouteGuideServer(s, &server{})
}

func (s *server) GetFeature(ctx context.Context, in *pb.Point) (*pb.Feature, error) {
	name := util.LookupFeature(in)
	if name == "" {
		name = "Somewhere on Earth"
	}
	feature := &pb.Feature{
		Name:     name,
		Location: in,
	}
	log.Printf("Info: Feature at %v is %s", in, feature.GetName())
	return feature, nil
}

func (s *server) ListFeatures(area *pb.Rectangle, stream pb.RouteGuide_ListFeaturesServer) error {
	log.Printf("Info: Looking for features in %v", area)
	for _, feature := range util.ListKnownFeatures() {
		log.Printf("Info: Checking %s at %v", feature, feature.Location)
		if util.InArea(feature.Location, area) {
			log.Printf("Info: Found feature %s at %v", feature, feature.Location)
			if err := stream.Send(feature); err != nil {
				return err
			}
		}
	}
	return nil
}

func (s *server) RecordRoute(stream pb.RouteGuide_RecordRouteServer) error {
	var pointCounter, featureCounter, distance int32
	var lastPoint *pb.Point
	startTime := time.Now()
	log.Printf("Info: Starting stream")

	for {
		point, err := stream.Recv()
		if err == io.EOF {
			log.Printf("Info: Stream ended")
			endTime := time.Now()
			summary := &pb.RouteSummary{
				PointCount:   pointCounter,
				FeatureCount: featureCounter,
				Distance:     distance,
				ElapsedTime:  int32(endTime.Sub(startTime).Seconds()),
			}
			return stream.SendAndClose(summary)
		}
		if err != nil {
			return err
		}
		log.Printf("Info: Received point %v", point)

		pointCounter++
		feature := util.LookupFeature(point)
		if feature != "" {
			log.Printf("Info: Point %v is in %s", point, feature)
			featureCounter++
		}

		if lastPoint != nil {
			distance += util.CalculateDistance(lastPoint, point)
		}

		lastPoint = point
	}
}
