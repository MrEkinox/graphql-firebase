import { storage } from "firebase-admin";
import { FileUpload } from "graphql-upload-minimal";
import { inputObjectType } from "nexus";
import async from "async";
import { Stream } from "stream";

export const UploadFileLinkInput = inputObjectType({
  name: "UploadFileLinkInput",
  definition(t) {
    t.string("name", { required: true });
    t.string("url", { required: true });
  },
});

export const UploadFileInput = inputObjectType({
  name: "UploadFileInput",
  definition(t) {
    t.field("upload", { type: "Upload" });
    t.field("link", { type: UploadFileLinkInput });
  },
});

export const UploadFileListInput = inputObjectType({
  name: "UploadFileListInput",
  definition(t) {
    t.field("add", { type: "Upload", list: true });
    t.field("link", { type: UploadFileLinkInput, list: true });
    t.string("remove", { list: true });
  },
});

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

const uploadFile = async (input: Promise<FileUpload>) => {
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

  return { name: filename, url: publicUrl, isLinked: false };
};

export const fileListToFirestore = async (
  input: UploadFileListInputType,
  currentData: FileInfoType[] = []
) => {
  const { link = [], add = [], remove = [] } = input;
  const addedFiles = await async.map(add || [], uploadFile);
  const linked = link.map((link) => ({ ...link, isLinked: true }));

  const newCurrentData = await async.filter(currentData, async (file) => {
    if (remove.includes(file.name)) {
      try {
        if (!file.isLinked) await storage().bucket().file(file.name).delete();
        return false;
      } catch (error) {
        return true;
      }
    }
    return true;
  });

  return newCurrentData.concat(addedFiles).concat(linked);
};

export const fileToFirestore = async (
  input: UploadFileInputType | null,
  currentData?: FileInfoType | null
): Promise<FileInfoType | null> => {
  if (currentData && input?.upload && input.link && !currentData.isLinked) {
    await storage().bucket().file(currentData.name).delete();
  }
  if (input?.upload) {
    return uploadFile(input.upload);
  }
  if (input?.link) {
    return { ...input.link, isLinked: true };
  }
  return null;
};
