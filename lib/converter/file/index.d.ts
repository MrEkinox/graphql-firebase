import { FileInfoType, UploadFileInput as UploadFileInputType, UploadFileListInput as UploadFileListInputType } from "../../interfaces";
export declare const UploadFileLinkInput: import("nexus/dist/core").NexusInputObjectTypeDef<"UploadFileLinkInput">;
export declare const UploadFileInput: import("nexus/dist/core").NexusInputObjectTypeDef<"UploadFileInput">;
export declare const UploadFileListInput: import("nexus/dist/core").NexusInputObjectTypeDef<"UploadFileListInput">;
export declare const fileListToFireStore: (input: UploadFileListInputType | null, currentData?: FileInfoType[] | null) => Promise<any[]>;
export declare const fileToFirestore: (input: UploadFileInputType | null, currentData?: FileInfoType | null) => Promise<FileInfoType | null>;
