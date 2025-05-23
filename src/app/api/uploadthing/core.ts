import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "~/auth";
import {db} from "~/server/db";
import { images } from "~/server/db/schema";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  bakonykutiGalleryImageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new Error("You must be logged in to upload");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await db.insert(images).values({
        title: file.name,
        url: file.url,
        });
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  bakonykutiNewsImageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (!session?.user) throw new Error("You must be logged in to upload");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
          // This code RUNS ON YOUR SERVER after upload
      await db.insert(images).values({
        title: file.name,
        url: file.url,
        gallery: false,
        image_size: file.size,
        });
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
    bakonykutiDocumentPdfUploader: f({
        pdf: {
          /**
           * For full list of options and defaults, see the File Route API reference
           * @see https://docs.uploadthing.com/file-routes#route-config
           */
          maxFileSize: "4MB",
          maxFileCount: 1,
        },
      })
        .middleware(async ({ req }) => {
          // This code runs on your server before upload
          const session = await auth();

          // If you throw, the user will not be able to upload
          if (!session?.user) throw new Error("You must be logged in to upload");

          // Whatever is returned here is accessible in onUploadComplete as `metadata`
          return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
          // This code RUNS ON YOUR SERVER after upload
          console.log("Upload complete for userId:", metadata.userId);

          console.log("file url", file.url);

          // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
          return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
