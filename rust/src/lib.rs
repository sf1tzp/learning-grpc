pub mod hello_world {
    tonic::include_proto!("helloworld");
}

pub mod route_guide {
    tonic::include_proto!("routeguide");
}

pub mod google {
    pub mod rpc {
        tonic::include_proto!("google.rpc");
    }
}
