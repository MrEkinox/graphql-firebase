import { FileUpload, Upload } from "graphql-upload-minimal";
import {
  FileInfoType,
  UploadFileInput as UploadFileInputType,
  UploadFileListInput as UploadFileListInputType,
} from "../../interfaces";
import { storage } from "firebase-admin";
import async from "async";
import { Stream } from "stream";
import { inputObjectType } from "nexus";

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

    stream.on("error", (error) => {
      writeStream.destroy(error);
      reject(error);
    });

    stream.pipe(writeStream);
  });

  const publicUrl = await file.publicUrl();

  return { name: filename, url: publicUrl, isLinked: false };
};

export const fileListToFireStore = async (
  input: UploadFileListInputType | null,
  currentData?: FileInfoType[] | null
) => {
  const addedFiles: any[] = await async.map(input?.add || [], uploadFile);
  const linked = (input?.link || []).map((link) => ({
    ...link,
    isLinked: true,
  }));

  await async.map(input?.remove || [], async (name) => {
    const curFile = currentData?.find((cur) => cur.name === name);
    if (!curFile) return;
    await storage().bucket().file(curFile.name).delete();
  });

  return [...(currentData || []), ...addedFiles, ...linked].filter(
    (file) => !input?.remove?.includes(file.name)
  );
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
