fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure()
        .compile(
        &[
            "../protobuf/helloworld/helloworld.proto",
            "../protobuf/routeguide/routeguide.proto",
            "../protobuf/googleapis/google/rpc/status.proto",
        ],
        &["../protobuf"],
    )?;
    Ok(())
}
