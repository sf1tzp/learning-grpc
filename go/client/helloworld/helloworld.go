package helloworld

import (
	"context"

	pb "github.com/sf1tzp/learning-grpc/go/protobuf/helloworld"
	"google.golang.org/grpc"
)

type HelloWorldClient struct {
	client pb.GreeterClient
}

func NewHelloWorldClient(connection *grpc.ClientConn) HelloWorldClient {
	return HelloWorldClient{
		client: pb.NewGreeterClient(connection),
	}
}

func (c *HelloWorldClient) Hello(ctx context.Context, name string) (string, error) {
	response, err := c.client.SayHello(ctx, &pb.HelloRequest{Name: name})
	if err != nil {
		return "", err
	}
	return response.GetMessage(), nil
}

func (c *HelloWorldClient) HelloAgain(ctx context.Context, name string) (string, error) {
	response, err := c.client.SayHelloAgain(ctx, &pb.HelloRequest{Name: name})
	if err != nil {
		return "", err
	}
	return response.GetMessage(), nil
}
