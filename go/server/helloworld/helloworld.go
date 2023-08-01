package helloworld

import (
	"context"
	"fmt"
	"log"

	pb "github.com/sf1tzp/learning-grpc/go/protobuf/helloworld"
	"google.golang.org/grpc"
)

// server is used to implement helloworld.GreeterServer.
type server struct {
	pb.UnimplementedGreeterServer
}

// SayHello implements helloworld.GreeterServer
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	message := fmt.Sprintf("Hello to %s", in.GetName())
	log.Printf("Info: %v", message)
	return &pb.HelloReply{Message: message}, nil
}

func (s *server) SayHelloAgain(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	message := fmt.Sprintf("Hello to %s again", in.GetName())
	log.Printf("Info: %v", message)
	return &pb.HelloReply{Message: message}, nil
}

func RegisterServer(s *grpc.Server) {
	pb.RegisterGreeterServer(s, &server{})
}
