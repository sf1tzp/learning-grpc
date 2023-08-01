package routeguide

import (
	"context"
	"io"
	"log"
	"time"

	pb "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"
	"github.com/umahmood/haversine"
	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedRouteGuideServer
}

var KnownFeatures = map[struct {
	Latitude  int32
	Longitude int32
}]string{
	// Using ints for lat/long values to try to avoid floating point rounding errors.
	{Latitude: 386270000, Longitude: -901994000}: "Saint Louis",
	{Latitude: 397391999, Longitude: -104990300}: "Denver", // Although Devner's still weird
	{Latitude: 327157000, Longitude: -117161100}: "San Diego",
	{Latitude: 377749000, Longitude: -122419400}: "San Francisco",
	{Latitude: 440570000, Longitude: -123086900}: "Eugene",
}

func RegisterServer(s *grpc.Server) {
	pb.RegisterRouteGuideServer(s, &server{})
}

func (s *server) GetFeature(ctx context.Context, in *pb.Point) (*pb.Feature, error) {
	name := lookupFeature(in)
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
		feature := lookupFeature(point)
		if feature != "" {
			log.Printf("Info: Point %v is in %s", point, feature)
			featureCounter++
		}

		if lastPoint != nil {
			distance += calcDistance(lastPoint, point)
		}

		lastPoint = point
	}
}

func lookupFeature(point *pb.Point) string {
	lookupKey := struct {
		Latitude  int32
		Longitude int32
	}{
		Latitude:  int32(point.Latitude * 1e7),
		Longitude: int32(point.Longitude * 1e7),
	}
	if feature, ok := KnownFeatures[lookupKey]; ok {
		return feature
	}
	return ""
}

func calcDistance(start, end *pb.Point) int32 {
	p1 := haversine.Coord{
		Lat: start.Latitude,
		Lon: start.Longitude,
	}

	p2 := haversine.Coord{
		Lat: end.Latitude,
		Lon: end.Longitude,
	}

	miles, _ := haversine.Distance(p1, p2)
	return int32(miles)
}
