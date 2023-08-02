# gRPC Hello World

Sourced from [grpc/grpc-go](https://github.com/grpc/grpc-go/tree/master/examples/helloworld). Thanks!

This repo includes [google's apis](https://github.com/googleapis/googleapis/tree/master/google/rpc) as a submodule, in order to import some of their `.proto` files. Run `git submodule init --recusive` after cloning this repo to retrieve the files.

This repo includes a [Justfile](https://github.com/casey/just). Available recipes:
```
    generate    # Generate gRPC bindings for both projects
    go-client   # Run the go-based client
    go-server   # Run the go-based server
    rust-client # Run the rust-based client
    rust-server # Run the rust-based server
```
