package routeguide

import (
	"context"
	"log"

	rg "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"
	"google.golang.org/grpc"
)

type server struct {
	rg.UnimplementedRouteGuideServer
}

func RegisterServer(s *grpc.Server) {
	rg.RegisterRouteGuideServer(s, &server{})
}

func (s *server) GetFeature(ctx context.Context, in *rg.Point) (*rg.Feature, error) {
	feature := &rg.Feature{
		Name:     "Earth",
		Location: in,
	}
	log.Printf("Info: Feature at %v is %s", in, feature.GetName())
	return feature, nil
}
