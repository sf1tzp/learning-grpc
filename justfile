generate-go:
    #!/usr/bin/env bash
    protoc \
    --go_out=go \
    --go_opt=paths=source_relative \
    --go-grpc_out=go \
    --go-grpc_opt=paths=source_relative \
    helloworld/helloworld.proto

go-server:
    #!/usr/bin/env bash
    cd go
    go run greeter_server/main.go

go-client:
    #!/usr/bin/env bash
    cd go
    go run greeter_client/main.go
