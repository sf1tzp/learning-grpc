package routeguide_util

import (
	"fmt"

	pb "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"
	"github.com/umahmood/haversine"
)

// Data for the RouteGuide server
var knownFeatures = map[struct {
	Latitude  int64
	Longitude int64
}]string{
	// Using ints for lat/long values to try to avoid floating point rounding errors.
	{Latitude: 386270000, Longitude: -901994000}:  "Saint Louis",
	{Latitude: 397391999, Longitude: -1049903000}: "Denver", // Although Devner's still weird
	{Latitude: 327157000, Longitude: -1171611000}: "San Diego",
	{Latitude: 377749000, Longitude: -1224194000}: "San Francisco",
	{Latitude: 440570000, Longitude: -1230869000}: "Eugene",
}

var featureNotes = map[string][]string{
	"Saint Louis":   {"Home of the Gateway Arch"},
	"Denver":        {"Mile High City"},
	"San Diego":     {"Home of the San Diego Zoo"},
	"San Francisco": {"Home of the Golden Gate Bridge"},
	"Eugene":        {"Home of the University of Oregon"},
}

// Utility functions for the RouteGuide server
func ListKnownFeatures() []*pb.Feature {
	features := []*pb.Feature{}
	for key, name := range knownFeatures {
		features = append(features, &pb.Feature{
			Name: name,
			Location: &pb.Point{
				Latitude:  float64(key.Latitude / 1e7),
				Longitude: float64(key.Longitude / 1e7),
			},
		})
	}
	return features
}

func LookupFeature(point *pb.Point) string {
	lookupKey := struct {
		Latitude  int64
		Longitude int64
	}{
		Latitude:  int64(point.Latitude * 1e7),
		Longitude: int64(point.Longitude * 1e7),
	}
	if feature, ok := knownFeatures[lookupKey]; ok {
		return feature
	}
	return ""
}

func SaveFeature(point *pb.Point, name string) {
	lookupKey := struct {
		Latitude  int64
		Longitude int64
	}{
		Latitude:  int64(point.Latitude * 1e7),
		Longitude: int64(point.Longitude * 1e7),
	}
	knownFeatures[lookupKey] = name
}

func SaveNote(name string, note string) {
	featureNotes[name] = append(featureNotes[name], note)
}

func GetNotes(name string) ([]string, error) {
	notes, ok := featureNotes[name]
	if !ok {
		return nil, fmt.Errorf("no notes found for %s", name)
	}
	return notes, nil
}

func CalculateDistance(start, end *pb.Point) int32 {
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

func InArea(point *pb.Point, area *pb.Rectangle) bool {
	withinLatitude := point.Latitude >= area.BottomRight.Latitude && point.Latitude <= area.TopLeft.Latitude
	withinLongitude := point.Longitude >= area.TopLeft.Longitude && point.Longitude <= area.BottomRight.Longitude

	return withinLatitude && withinLongitude
}
