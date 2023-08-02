
# Generate gRPC bindings for both projects
generate: _generate-go _generate-rust

_generate-go:
    #!/usr/bin/env bash
    protoc \
    --go_out=go \
    --go_opt=paths=source_relative \
    --go-grpc_out=go \
    --go-grpc_opt=paths=source_relative \
    protobuf/**/*.proto
    if [ $? -eq 0 ]; then echo "Go gRPC bindings generated successfully"; fi

# Run the go-based server
go-server:
    #!/usr/bin/env bash
    cd go
    go run server/main.go

# Run the go-based client
go-client:
    #!/usr/bin/env bash
    cd go
    go run client/main.go

_generate-rust:
    #!/usr/bin/env bash
    cd rust
    cargo build

# Run the rust-based client
rust-client:
    #!/usr/bin/env bash
    cd rust
    cargo run --bin client

# Run the rust-based server
rust-server:
    #!/usr/bin/env bash
    cd rust
    cargo run --bin server
