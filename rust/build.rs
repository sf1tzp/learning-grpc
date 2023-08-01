fn main() -> Result<(), Box<dyn std::error::Error>> {
    tonic_build::compile_protos("../protobuf/helloworld/helloworld.proto")?;
    Ok(())
}
