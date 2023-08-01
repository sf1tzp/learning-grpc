package helloworld

import (
	"context"
	"fmt"
	"log"

	hw "github.com/sf1tzp/learning-grpc/go/protobuf/helloworld"
	"google.golang.org/grpc"
)

// server is used to implement helloworld.GreeterServer.
type server struct {
	hw.UnimplementedGreeterServer
}

// SayHello implements helloworld.GreeterServer
func (s *server) SayHello(ctx context.Context, in *hw.HelloRequest) (*hw.HelloReply, error) {
	message := fmt.Sprintf("Hello to %s", in.GetName())
	log.Printf("Info: %v", message)
	return &hw.HelloReply{Message: message}, nil
}

func (s *server) SayHelloAgain(ctx context.Context, in *hw.HelloRequest) (*hw.HelloReply, error) {
	message := fmt.Sprintf("Hello to %s again", in.GetName())
	log.Printf("Info: %v", message)
	return &hw.HelloReply{Message: message}, nil
}

func RegisterServer(s *grpc.Server) {
	hw.RegisterGreeterServer(s, &server{})
}
