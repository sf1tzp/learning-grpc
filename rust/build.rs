fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::configure().out_dir("src/protobuf").compile(
        &["../protobuf/helloworld/helloworld.proto"],
        &["../protobuf"],
    )?;
    tonic_build::configure().out_dir("src/protobuf").compile(
        &["../protobuf/routeguide/routeguide.proto"],
        &["../protobuf"],
    )?;
    Ok(())
}
