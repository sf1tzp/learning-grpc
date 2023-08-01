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
	Latitude  int64
	Longitude int64
}]string{
	// Using ints for lat/long values to try to avoid floating point rounding errors.
	{Latitude: 386270000, Longitude: -901994000}: "Saint Louis",
	{Latitude: 397391999, Longitude: -1049903000}: "Denver", // Although Devner's still weird
	{Latitude: 327157000, Longitude: -1171611000}: "San Diego",
	{Latitude: 377749000, Longitude: -1224194000}: "San Francisco",
	{Latitude: 440570000, Longitude: -1230869000}: "Eugene",
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

func (s *server) ListFeatures(area *pb.Rectangle, stream pb.RouteGuide_ListFeaturesServer) error {
	log.Printf("Info: Looking for features in %v", area)
	for location, feature := range KnownFeatures {
		point := &pb.Point{
			Latitude:  float64(location.Latitude) * 1e-7,
			Longitude: float64(location.Longitude) * 1e-7,
		}
		log.Printf("Info: Checking %s at %v", feature, point)
		if inArea(point, area) {
			log.Printf("Info: Found feature %s at %v", feature, point)
			feature := &pb.Feature{
				Name:     feature,
				Location: point,
			}
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
		Latitude  int64
		Longitude int64
	}{
		Latitude:  int64(point.Latitude * 1e7),
		Longitude: int64(point.Longitude * 1e7),
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

func inArea(point *pb.Point, area *pb.Rectangle) bool {
	withinLatitude := point.Latitude >= area.BottomRight.Latitude && point.Latitude <= area.TopLeft.Latitude
	withinLongitude := point.Longitude >= area.TopLeft.Longitude && point.Longitude <= area.BottomRight.Longitude

	return withinLatitude && withinLongitude
}
