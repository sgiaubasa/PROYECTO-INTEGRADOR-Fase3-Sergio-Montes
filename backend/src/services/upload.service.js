// backend/src/services/upload.service.js

import { v2 as cloudinary } from "cloudinary";
import stream from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 👉 función para subir el buffer (imagen temporal) a Cloudinary
export async function uploadBufferToCloudinary(buffer, filename, folder = process.env.CLOUDINARY_FOLDER || "fase3") {
  return new Promise((resolve, reject) => {
    const pass = new stream.PassThrough();
    const opts = {
      folder,
      public_id: filename?.replace(/\.[^.]+$/, "")?.slice(0, 80),
    };

    const uploadStream = cloudinary.uploader.upload_stream(opts, (err, result) => {
      if (err) return reject(err);
      resolve(result); // result.secure_url y result.public_id
    });

    pass.end(buffer);
    pass.pipe(uploadStream);
  });
}

// 👉 función para borrar una imagen de Cloudinary (si la reemplazás o eliminás un producto)
export async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Error al eliminar de Cloudinary:", err.message);
  }
}
