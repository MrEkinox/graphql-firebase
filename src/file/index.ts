import { storage } from "firebase-admin";
import { FileUpload } from "graphql-upload-minimal";
import { inputObjectType } from "nexus";
import { Stream } from "stream";

export const UploadFileInput = inputObjectType({
  name: "UploadFileInput",
  definition(t) {
    t.field("upload", { type: "Upload" });
    t.string("link");
  },
});

export const UploadFileListInput = inputObjectType({
  name: "UploadFileListInput",
  definition(t) {
    t.field("add", { type: "Upload", list: true });
    t.string("link", { list: true });
    t.string("remove", { list: true });
  },
});

export interface UploadFileInputType {
  upload?: Promise<FileUpload>;
  link?: string;
}

export interface UploadFileListInputType {
  add?: Promise<FileUpload>[];
  link?: string[];
  remove?: string[];
}

export const uploadFile = async (input: Promise<FileUpload>) => {
  const { createReadStream, filename } = await input;
  const stream: Stream = createReadStream();
  const file = storage().bucket().file(filename);

  await new Promise((resolve, reject) => {
    const writeStream = file.createWriteStream({
      validation: false,
      metadata: { cacheControl: "public,max-age=31536000" },
    });

    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
    stream.on("error", writeStream.destroy);
    stream.on("error", reject);
    stream.pipe(writeStream);
  });

  const publicUrl = await file.publicUrl();

  return publicUrl;
};
