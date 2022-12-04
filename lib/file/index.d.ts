import { FileUpload } from "graphql-upload-minimal";
export declare const UploadFileLinkInput: import("nexus/dist/core").NexusInputObjectTypeDef<"UploadFileLinkInput">;
export declare const UploadFileInput: import("nexus/dist/core").NexusInputObjectTypeDef<"UploadFileInput">;
export declare const UploadFileListInput: import("nexus/dist/core").NexusInputObjectTypeDef<"UploadFileListInput">;
export interface FileInfoType {
    url: string;
    name: string;
    isLinked?: boolean;
}
export interface UploadFileInputType {
    upload?: Promise<FileUpload>;
    link?: FileInfoType;
}
export interface UploadFileListInputType {
    add?: Promise<FileUpload>[];
    link?: FileInfoType[];
    remove?: string[];
}
export declare const fileListToFirestore: (input: UploadFileListInputType, currentData?: FileInfoType[]) => Promise<FileInfoType[]>;
export declare const fileToFirestore: (input: UploadFileInputType | null, currentData?: FileInfoType | null) => Promise<FileInfoType | null>;
