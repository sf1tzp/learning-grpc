// package: routeguide
// file: routeguide/routeguide.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as routeguide_routeguide_pb from "../routeguide/routeguide_pb";
import * as googleapis_google_rpc_status_pb from "../googleapis/google/rpc/status_pb";

interface IRouteGuideService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getFeature: IRouteGuideService_IGetFeature;
    listFeatures: IRouteGuideService_IListFeatures;
    recordRoute: IRouteGuideService_IRecordRoute;
    routeChat: IRouteGuideService_IRouteChat;
}

interface IRouteGuideService_IGetFeature extends grpc.MethodDefinition<routeguide_routeguide_pb.Point, routeguide_routeguide_pb.Feature> {
    path: "/routeguide.RouteGuide/GetFeature";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<routeguide_routeguide_pb.Point>;
    requestDeserialize: grpc.deserialize<routeguide_routeguide_pb.Point>;
    responseSerialize: grpc.serialize<routeguide_routeguide_pb.Feature>;
    responseDeserialize: grpc.deserialize<routeguide_routeguide_pb.Feature>;
}
interface IRouteGuideService_IListFeatures extends grpc.MethodDefinition<routeguide_routeguide_pb.Rectangle, routeguide_routeguide_pb.Feature> {
    path: "/routeguide.RouteGuide/ListFeatures";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<routeguide_routeguide_pb.Rectangle>;
    requestDeserialize: grpc.deserialize<routeguide_routeguide_pb.Rectangle>;
    responseSerialize: grpc.serialize<routeguide_routeguide_pb.Feature>;
    responseDeserialize: grpc.deserialize<routeguide_routeguide_pb.Feature>;
}
interface IRouteGuideService_IRecordRoute extends grpc.MethodDefinition<routeguide_routeguide_pb.Point, routeguide_routeguide_pb.RouteSummary> {
    path: "/routeguide.RouteGuide/RecordRoute";
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<routeguide_routeguide_pb.Point>;
    requestDeserialize: grpc.deserialize<routeguide_routeguide_pb.Point>;
    responseSerialize: grpc.serialize<routeguide_routeguide_pb.RouteSummary>;
    responseDeserialize: grpc.deserialize<routeguide_routeguide_pb.RouteSummary>;
}
interface IRouteGuideService_IRouteChat extends grpc.MethodDefinition<routeguide_routeguide_pb.RouteNote, routeguide_routeguide_pb.RouteNoteResponse> {
    path: "/routeguide.RouteGuide/RouteChat";
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<routeguide_routeguide_pb.RouteNote>;
    requestDeserialize: grpc.deserialize<routeguide_routeguide_pb.RouteNote>;
    responseSerialize: grpc.serialize<routeguide_routeguide_pb.RouteNoteResponse>;
    responseDeserialize: grpc.deserialize<routeguide_routeguide_pb.RouteNoteResponse>;
}

export const RouteGuideService: IRouteGuideService;

export interface IRouteGuideServer extends grpc.UntypedServiceImplementation {
    getFeature: grpc.handleUnaryCall<routeguide_routeguide_pb.Point, routeguide_routeguide_pb.Feature>;
    listFeatures: grpc.handleServerStreamingCall<routeguide_routeguide_pb.Rectangle, routeguide_routeguide_pb.Feature>;
    recordRoute: grpc.handleClientStreamingCall<routeguide_routeguide_pb.Point, routeguide_routeguide_pb.RouteSummary>;
    routeChat: grpc.handleBidiStreamingCall<routeguide_routeguide_pb.RouteNote, routeguide_routeguide_pb.RouteNoteResponse>;
}

export interface IRouteGuideClient {
    getFeature(request: routeguide_routeguide_pb.Point, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.Feature) => void): grpc.ClientUnaryCall;
    getFeature(request: routeguide_routeguide_pb.Point, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.Feature) => void): grpc.ClientUnaryCall;
    getFeature(request: routeguide_routeguide_pb.Point, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.Feature) => void): grpc.ClientUnaryCall;
    listFeatures(request: routeguide_routeguide_pb.Rectangle, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<routeguide_routeguide_pb.Feature>;
    listFeatures(request: routeguide_routeguide_pb.Rectangle, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<routeguide_routeguide_pb.Feature>;
    recordRoute(callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.RouteSummary) => void): grpc.ClientWritableStream<routeguide_routeguide_pb.Point>;
    recordRoute(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.RouteSummary) => void): grpc.ClientWritableStream<routeguide_routeguide_pb.Point>;
    recordRoute(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.RouteSummary) => void): grpc.ClientWritableStream<routeguide_routeguide_pb.Point>;
    recordRoute(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.RouteSummary) => void): grpc.ClientWritableStream<routeguide_routeguide_pb.Point>;
    routeChat(): grpc.ClientDuplexStream<routeguide_routeguide_pb.RouteNote, routeguide_routeguide_pb.RouteNoteResponse>;
    routeChat(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<routeguide_routeguide_pb.RouteNote, routeguide_routeguide_pb.RouteNoteResponse>;
    routeChat(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<routeguide_routeguide_pb.RouteNote, routeguide_routeguide_pb.RouteNoteResponse>;
}

export class RouteGuideClient extends grpc.Client implements IRouteGuideClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getFeature(request: routeguide_routeguide_pb.Point, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.Feature) => void): grpc.ClientUnaryCall;
    public getFeature(request: routeguide_routeguide_pb.Point, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.Feature) => void): grpc.ClientUnaryCall;
    public getFeature(request: routeguide_routeguide_pb.Point, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.Feature) => void): grpc.ClientUnaryCall;
    public listFeatures(request: routeguide_routeguide_pb.Rectangle, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<routeguide_routeguide_pb.Feature>;
    public listFeatures(request: routeguide_routeguide_pb.Rectangle, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<routeguide_routeguide_pb.Feature>;
    public recordRoute(callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.RouteSummary) => void): grpc.ClientWritableStream<routeguide_routeguide_pb.Point>;
    public recordRoute(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.RouteSummary) => void): grpc.ClientWritableStream<routeguide_routeguide_pb.Point>;
    public recordRoute(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.RouteSummary) => void): grpc.ClientWritableStream<routeguide_routeguide_pb.Point>;
    public recordRoute(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: routeguide_routeguide_pb.RouteSummary) => void): grpc.ClientWritableStream<routeguide_routeguide_pb.Point>;
    public routeChat(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<routeguide_routeguide_pb.RouteNote, routeguide_routeguide_pb.RouteNoteResponse>;
    public routeChat(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<routeguide_routeguide_pb.RouteNote, routeguide_routeguide_pb.RouteNoteResponse>;
}
