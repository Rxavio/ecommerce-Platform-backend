import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function uploadBuffer(buffer: Buffer, folder = "products") {
  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result!.secure_url, public_id: result!.public_id });
      },
    );
    stream.end(buffer);
  });
}

export async function deleteByPublicId(public_id: string) {
  return cloudinary.uploader.destroy(public_id);
}
