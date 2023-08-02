package routeguide

import (
	pb "github.com/sf1tzp/learning-grpc/go/protobuf/routeguide"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func buildRouteNoteErrorResponse(request *pb.RouteNote, e error, code codes.Code) (*pb.RouteNoteResponse, error) {
	grpcErr := status.New(code, e.Error())
	grpcErr, err := grpcErr.WithDetails(request)
	if err != nil {
		return nil, err
	}

	return &pb.RouteNoteResponse{
		Message: &pb.RouteNoteResponse_Error{
			Error: grpcErr.Proto(),
		},
	}, nil
}
