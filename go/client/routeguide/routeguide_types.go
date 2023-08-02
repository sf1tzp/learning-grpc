package routeguide

import pb "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"

// Wrapper types for the protobuf types
type Point struct {
	Latitude  float64
	Longitude float64
}

func (p *Point) unwrap() *pb.Point {
	return &pb.Point{
		Latitude:  p.Latitude,
		Longitude: p.Longitude,
	}
}

type Area struct {
	TopLeft     Point
	BottomRight Point
}

func (a *Area) unwrap() *pb.Rectangle {
	return &pb.Rectangle{
		TopLeft:     a.TopLeft.unwrap(),
		BottomRight: a.BottomRight.unwrap(),
	}
}

type Note struct {
	Name     string
	Location Point
	Message  string
}

func (n *Note) unwrap() *pb.RouteNote {
	return &pb.RouteNote{
		Name:     n.Name,
		Location: n.Location.unwrap(),
		Message:  n.Message,
	}
}
