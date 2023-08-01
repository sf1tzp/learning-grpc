package routeguide_util

import (
	"testing"

	pb "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"
	"github.com/stretchr/testify/assert"
)

func TestCalculateDistance(t *testing.T) {
	cases := []struct {
		name             string
		p1               pb.Point
		p2               pb.Point
		expectedDistance int32
	}{
		{
			name:             "zero distance",
			p1:               pb.Point{Latitude: 0, Longitude: 0},
			p2:               pb.Point{Latitude: 0, Longitude: 0},
			expectedDistance: 0,
		},
		{
			name:             "Saint Louis to Denver",
			p1:               pb.Point{Latitude: 38.6270, Longitude: -90.19940},
			p2:               pb.Point{Latitude: 39.7392, Longitude: -104.9903},
			expectedDistance: 794,
		},
	}

	for _, c := range cases {
		d := CalculateDistance(&c.p1, &c.p2)
		assert.Equal(t, c.expectedDistance, d, c.name)
	}
}

func TestInArea(t *testing.T) {
	cases := []struct {
		name     string
		point    pb.Point
		area     pb.Rectangle
		expected bool
	}{
		{
			name:  "point in area",
			point: pb.Point{Latitude: 38.6270, Longitude: -90.19940},
			area: pb.Rectangle{
				TopLeft:     &pb.Point{Latitude: 38.818967, Longitude: -90.595613},
				BottomRight: &pb.Point{Latitude: 38.524764, Longitude: -90.050680},
			},
			expected: true,
		},
		{
			name:  "point not in area",
			point: pb.Point{Latitude: 38.6270, Longitude: -90.19940},
			area: pb.Rectangle{
				TopLeft:     &pb.Point{Latitude: 40.818967, Longitude: -100.595613},
				BottomRight: &pb.Point{Latitude: 40.724764, Longitude: -100.050680},
			},
			expected: false,
		},
	}

	for _, c := range cases {
		assert.Equal(t, c.expected, InArea(&c.point, &c.area), c.name)
	}
}
