generate-go:
    #!/usr/bin/env bash
    protoc \
    --go_out=go \
    --go_opt=paths=source_relative \
    --go-grpc_out=go \
    --go-grpc_opt=paths=source_relative \
    protobuf/helloworld/helloworld.proto

go-server:
    #!/usr/bin/env bash
    cd go
    go run greeter_server/main.go

go-client:
    #!/usr/bin/env bash
    cd go
    go run greeter_client/main.go

generate-rust:
    #!/usr/bin/env bash
    cd rust
    cargo build

rust-client:
    #!/usr/bin/env bash
    cd rust
    cargo run src/greeter_client.rs