# Generate gRPC bindings for all projects
generate: _generate-go _generate-rust _generate-node

_generate-go:
    #!/usr/bin/env bash
    protoc \
    --go_out=go/protobuf \
    --go_opt=paths=source_relative \
    --go-grpc_out=go/protobuf \
    --go-grpc_opt=paths=source_relative \
    --proto_path=protobuf \
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

_generate-node: _build-typescript
    #!/usr/bin/env bash
    set -e
    cd node
    npx grpc_tools_node_protoc \
        --proto_path=../protobuf \
        --grpc_out=grpc_js:protobuf \
        --js_out=import_style=commonjs,binary:protobuf \
        ../protobuf/**/*.proto
    npx grpc_tools_node_protoc \
        --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
        --proto_path=../protobuf \
        --ts_out=grpc_js:protobuf \
        ../protobuf/**/*.proto

    if [ $? -eq 0 ]; then echo "Node gRPC bindings generated successfully"; fi

_build-typescript:
    #!/usr/bin/env bash
    cd node
    npm install
    npx tsc

node-client: _build-typescript
    #!/usr/bin/env bash
    cd node
    node dist/client.js