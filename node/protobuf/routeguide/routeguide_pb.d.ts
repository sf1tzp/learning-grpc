// package: routeguide
// file: routeguide/routeguide.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as googleapis_google_rpc_status_pb from "../googleapis/google/rpc/status_pb";

export class Point extends jspb.Message { 
    getLatitude(): number;
    setLatitude(value: number): Point;
    getLongitude(): number;
    setLongitude(value: number): Point;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Point.AsObject;
    static toObject(includeInstance: boolean, msg: Point): Point.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Point, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Point;
    static deserializeBinaryFromReader(message: Point, reader: jspb.BinaryReader): Point;
}

export namespace Point {
    export type AsObject = {
        latitude: number,
        longitude: number,
    }
}

export class Rectangle extends jspb.Message { 

    hasTopleft(): boolean;
    clearTopleft(): void;
    getTopleft(): Point | undefined;
    setTopleft(value?: Point): Rectangle;

    hasBottomright(): boolean;
    clearBottomright(): void;
    getBottomright(): Point | undefined;
    setBottomright(value?: Point): Rectangle;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Rectangle.AsObject;
    static toObject(includeInstance: boolean, msg: Rectangle): Rectangle.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Rectangle, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Rectangle;
    static deserializeBinaryFromReader(message: Rectangle, reader: jspb.BinaryReader): Rectangle;
}

export namespace Rectangle {
    export type AsObject = {
        topleft?: Point.AsObject,
        bottomright?: Point.AsObject,
    }
}

export class Feature extends jspb.Message { 

    hasLocation(): boolean;
    clearLocation(): void;
    getLocation(): Point | undefined;
    setLocation(value?: Point): Feature;
    getName(): string;
    setName(value: string): Feature;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Feature.AsObject;
    static toObject(includeInstance: boolean, msg: Feature): Feature.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Feature, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Feature;
    static deserializeBinaryFromReader(message: Feature, reader: jspb.BinaryReader): Feature;
}

export namespace Feature {
    export type AsObject = {
        location?: Point.AsObject,
        name: string,
    }
}

export class RouteNote extends jspb.Message { 

    hasLocation(): boolean;
    clearLocation(): void;
    getLocation(): Point | undefined;
    setLocation(value?: Point): RouteNote;
    getMessage(): string;
    setMessage(value: string): RouteNote;
    getName(): string;
    setName(value: string): RouteNote;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RouteNote.AsObject;
    static toObject(includeInstance: boolean, msg: RouteNote): RouteNote.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RouteNote, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RouteNote;
    static deserializeBinaryFromReader(message: RouteNote, reader: jspb.BinaryReader): RouteNote;
}

export namespace RouteNote {
    export type AsObject = {
        location?: Point.AsObject,
        message: string,
        name: string,
    }
}

export class RouteNoteResponse extends jspb.Message { 

    hasRoutenote(): boolean;
    clearRoutenote(): void;
    getRoutenote(): RouteNote | undefined;
    setRoutenote(value?: RouteNote): RouteNoteResponse;

    hasError(): boolean;
    clearError(): void;
    getError(): googleapis_google_rpc_status_pb.Status | undefined;
    setError(value?: googleapis_google_rpc_status_pb.Status): RouteNoteResponse;

    getMessageCase(): RouteNoteResponse.MessageCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RouteNoteResponse.AsObject;
    static toObject(includeInstance: boolean, msg: RouteNoteResponse): RouteNoteResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RouteNoteResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RouteNoteResponse;
    static deserializeBinaryFromReader(message: RouteNoteResponse, reader: jspb.BinaryReader): RouteNoteResponse;
}

export namespace RouteNoteResponse {
    export type AsObject = {
        routenote?: RouteNote.AsObject,
        error?: googleapis_google_rpc_status_pb.Status.AsObject,
    }

    export enum MessageCase {
        MESSAGE_NOT_SET = 0,
        ROUTENOTE = 1,
        ERROR = 2,
    }

}

export class RouteSummary extends jspb.Message { 
    getPointcount(): number;
    setPointcount(value: number): RouteSummary;
    getFeaturecount(): number;
    setFeaturecount(value: number): RouteSummary;
    getDistance(): number;
    setDistance(value: number): RouteSummary;
    getElapsedtime(): number;
    setElapsedtime(value: number): RouteSummary;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RouteSummary.AsObject;
    static toObject(includeInstance: boolean, msg: RouteSummary): RouteSummary.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RouteSummary, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RouteSummary;
    static deserializeBinaryFromReader(message: RouteSummary, reader: jspb.BinaryReader): RouteSummary;
}

export namespace RouteSummary {
    export type AsObject = {
        pointcount: number,
        featurecount: number,
        distance: number,
        elapsedtime: number,
    }
}
