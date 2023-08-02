fn main() -> Result<(), Box<dyn std::error::Error>> {
    // FIXME: Failing to compile, because of the import statement in routeguide.proto
    // `"protoc failed: protobuf/googleapis/google/rpc/status.proto: File not found.\nrouteguide/routeguide.proto:5:1: Import \"protobuf/googleapis/google/rpc/status.proto\" was not found or had errors.`
    tonic_build::configure().out_dir("src/protobuf").compile(
        &[
            "../protobuf/helloworld/helloworld.proto",
            "../protobuf/routeguide/routeguide.proto",
            // "../protobuf/googleapis/google/rpc/status.proto", 
        ],
        &["../protobuf"],
    )?;
    Ok(())
}
