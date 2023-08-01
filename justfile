generate:
    protoc \
    --go_out=. \
    --go_opt=paths=source_relative \
    --go-grpc_out=. \
    --go-grpc_opt=paths=source_relative \
    helloworld/helloworld.proto

go-server:
    go run greeter_server/main.go

go-client:
    go run greeter_client/main.go