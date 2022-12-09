import { FileUpload } from "graphql-upload-minimal";
export declare const UploadFileInput: import("nexus/dist/core").NexusInputObjectTypeDef<"UploadFileInput">;
export declare const UploadFileListInput: import("nexus/dist/core").NexusInputObjectTypeDef<"UploadFileListInput">;
export interface UploadFileInputType {
    upload?: Promise<FileUpload>;
    link?: string;
}
export interface UploadFileListInputType {
    add?: Promise<FileUpload>[];
    link?: string[];
    remove?: string[];
}
export declare const uploadFile: (input: Promise<FileUpload>) => Promise<string>;
