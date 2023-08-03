// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var routeguide_routeguide_pb = require('../routeguide/routeguide_pb.js');
var googleapis_google_rpc_status_pb = require('../googleapis/google/rpc/status_pb.js');

function serialize_routeguide_Feature(arg) {
  if (!(arg instanceof routeguide_routeguide_pb.Feature)) {
    throw new Error('Expected argument of type routeguide.Feature');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_routeguide_Feature(buffer_arg) {
  return routeguide_routeguide_pb.Feature.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_routeguide_Point(arg) {
  if (!(arg instanceof routeguide_routeguide_pb.Point)) {
    throw new Error('Expected argument of type routeguide.Point');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_routeguide_Point(buffer_arg) {
  return routeguide_routeguide_pb.Point.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_routeguide_Rectangle(arg) {
  if (!(arg instanceof routeguide_routeguide_pb.Rectangle)) {
    throw new Error('Expected argument of type routeguide.Rectangle');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_routeguide_Rectangle(buffer_arg) {
  return routeguide_routeguide_pb.Rectangle.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_routeguide_RouteNote(arg) {
  if (!(arg instanceof routeguide_routeguide_pb.RouteNote)) {
    throw new Error('Expected argument of type routeguide.RouteNote');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_routeguide_RouteNote(buffer_arg) {
  return routeguide_routeguide_pb.RouteNote.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_routeguide_RouteNoteResponse(arg) {
  if (!(arg instanceof routeguide_routeguide_pb.RouteNoteResponse)) {
    throw new Error('Expected argument of type routeguide.RouteNoteResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_routeguide_RouteNoteResponse(buffer_arg) {
  return routeguide_routeguide_pb.RouteNoteResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_routeguide_RouteSummary(arg) {
  if (!(arg instanceof routeguide_routeguide_pb.RouteSummary)) {
    throw new Error('Expected argument of type routeguide.RouteSummary');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_routeguide_RouteSummary(buffer_arg) {
  return routeguide_routeguide_pb.RouteSummary.deserializeBinary(new Uint8Array(buffer_arg));
}


var RouteGuideService = exports.RouteGuideService = {
  getFeature: {
    path: '/routeguide.RouteGuide/GetFeature',
    requestStream: false,
    responseStream: false,
    requestType: routeguide_routeguide_pb.Point,
    responseType: routeguide_routeguide_pb.Feature,
    requestSerialize: serialize_routeguide_Point,
    requestDeserialize: deserialize_routeguide_Point,
    responseSerialize: serialize_routeguide_Feature,
    responseDeserialize: deserialize_routeguide_Feature,
  },
  listFeatures: {
    path: '/routeguide.RouteGuide/ListFeatures',
    requestStream: false,
    responseStream: true,
    requestType: routeguide_routeguide_pb.Rectangle,
    responseType: routeguide_routeguide_pb.Feature,
    requestSerialize: serialize_routeguide_Rectangle,
    requestDeserialize: deserialize_routeguide_Rectangle,
    responseSerialize: serialize_routeguide_Feature,
    responseDeserialize: deserialize_routeguide_Feature,
  },
  recordRoute: {
    path: '/routeguide.RouteGuide/RecordRoute',
    requestStream: true,
    responseStream: false,
    requestType: routeguide_routeguide_pb.Point,
    responseType: routeguide_routeguide_pb.RouteSummary,
    requestSerialize: serialize_routeguide_Point,
    requestDeserialize: deserialize_routeguide_Point,
    responseSerialize: serialize_routeguide_RouteSummary,
    responseDeserialize: deserialize_routeguide_RouteSummary,
  },
  routeChat: {
    path: '/routeguide.RouteGuide/RouteChat',
    requestStream: true,
    responseStream: true,
    requestType: routeguide_routeguide_pb.RouteNote,
    responseType: routeguide_routeguide_pb.RouteNoteResponse,
    requestSerialize: serialize_routeguide_RouteNote,
    requestDeserialize: deserialize_routeguide_RouteNote,
    responseSerialize: serialize_routeguide_RouteNoteResponse,
    responseDeserialize: deserialize_routeguide_RouteNoteResponse,
  },
};

exports.RouteGuideClient = grpc.makeGenericClientConstructor(RouteGuideService);
