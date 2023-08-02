package routeguide

import pb "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"

// Wrapper types for the protobuf types
type Point struct {
	Latitude  float64
	Longitude float64
}

func (p *Point) unWrap() *pb.Point {
	return &pb.Point{
		Latitude:  p.Latitude,
		Longitude: p.Longitude,
	}
}

type Area struct {
	TopLeft     Point
	BottomRight Point
}

func (a *Area) unWrap() *pb.Rectangle {
	return &pb.Rectangle{
		TopLeft:     a.TopLeft.unWrap(),
		BottomRight: a.BottomRight.unWrap(),
	}
}

type Note struct {
	Name     string
	Location Point
	Message  string
}

func (n *Note) unWrap() *pb.RouteNote {
	return &pb.RouteNote{
		Name:     n.Name,
		Location: n.Location.unWrap(),
		Message:  n.Message,
	}
}
