/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Package main implements a client for Greeter service.
package main

import (
	"context"
	"flag"
	"log"
	"strings"
	"time"

	hw "github.com/sf1tzp/learning-grpc/go/client/helloworld"
	rg "github.com/sf1tzp/learning-grpc/go/client/routeguide"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

const (
	defaultName = "Go the Gopher 😎"
)

var (
	addr = flag.String("addr", "localhost:50051", "the address to connect to")
	name = flag.String("name", defaultName, "Name to greet")
)

func main() {
	flag.Parse()
	// Set up a connection to the server.
	conn, err := grpc.Dial(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()

	// Contact the server and print out its response.
	err = callHelloWorldAPIs(conn)
	if err != nil {
		log.Fatalf("callHelloWorldAPIs failed :( %v", err)
	}

	// Route guide
	err = callRouteGuideAPIs(conn)
	if err != nil {
		log.Fatalf("callRouteGuideAPIs failed :( %v", err)
	}

}

func callHelloWorldAPIs(conn *grpc.ClientConn) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	client := hw.NewHelloWorldClient(conn)

	response, err := client.Hello(ctx, *name)
	if err != nil {
		return err
	}
	log.Printf("Greeting: %s", response)

	response, err = client.HelloAgain(ctx, *name)
	if err != nil {
		return err
	}
	log.Printf("Greeting: %s", response)

	return nil
}

func callRouteGuideAPIs(conn *grpc.ClientConn) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	client := rg.NewRouteGuideClient(conn)

	log.Printf("Trying GetFeature (Unary)")
	point := rg.Point{
		Latitude:  0.0,
		Longitude: 0.0,
	}

	feature, err := client.GetFeature(ctx, &point)
	if err != nil {
		return err
	}
	log.Printf("Feature: %s", feature)

	point = rg.Point{
		Latitude:  38.6270,
		Longitude: -90.19940,
	}

	feature, err = client.GetFeature(ctx, &point)
	if err != nil {
		return err
	}
	log.Printf("Feature: %s", feature)

	log.Printf("Trying RecordRoute (Client Streaming)")
	points := []rg.Point{
		{Latitude: 38.6270, Longitude: -90.19940},
		{Latitude: 39.7392, Longitude: -104.9903},
		{Latitude: 32.7157, Longitude: -117.1611},
		{Latitude: 37.7749, Longitude: -122.4194},
		{Latitude: 44.0570, Longitude: -123.0869},
	}

	distance, err := client.GetRouteDistance(ctx, points)
	if err != nil {
		return err
	}
	log.Printf("Route Distance: %d", distance)

	log.Printf("Trying ListFeatures (Server Streaming)")
	area := rg.Area{
		TopLeft: rg.Point{
			Latitude:  50.030520,
			Longitude: -126.800328,
		},
		BottomRight: rg.Point{
			Latitude:  20.104646,
			Longitude: -75.219728,
		},
	}

	features, err := client.ListFeatures(ctx, area)
	if err != nil {
		return err
	}
	log.Printf("Features within %v: %s", area, strings.Join(features, ", "))

	log.Println("Trying RouteChat (Bidirectional Streaming)")
	notes := []rg.Note{
		{
			Location: rg.Point{
				Latitude:  0.0,
				Longitude: 0.0,
			},
			Message: "First Note",
		},
	}

	err = client.RouteChat(ctx, notes)
	if err != nil {
		return err
	}

	return nil
}
