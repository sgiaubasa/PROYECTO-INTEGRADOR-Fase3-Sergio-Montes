// backend/src/config/mongoose.config.js
import mongoose from "mongoose";

let cached = global._mongooseCached;
if (!cached) cached = global._mongooseCached = { conn: null, promise: null, ok: false };

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("[DB] MONGODB_URI no está definido");
    cached.ok = false;
    return null;
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set("bufferCommands", false);
    mongoose.set("strictQuery", true);
    const opts = { serverSelectionTimeoutMS: 10000, socketTimeoutMS: 20000 };

    console.log("[DB] Conectando a MongoDB…");
    cached.promise = mongoose.connect(uri, opts)
      .then((m) => { 
        console.log("[DB] OK:", m.connection.host); 
        cached.ok = true; 
        return m; 
      })
      .catch((e) => { 
        console.error("[DB] Error:", e.message); 
        cached.ok = false; 
        throw e; 
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export function isDBConnected() {
  return cached.ok === true && mongoose.connection?.readyState === 1;
}

/* ✅ VALIDADOR DE ObjectId */
export function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

/* ✅ CONVERSOR seguro */
export function toObjectId(id) {
  if (!isValidId(id)) throw new Error("ID de Mongo inválido");
  return new mongoose.Types.ObjectId(String(id));
}

/* ✅ Export default opcional */
export default { connectDB, isDBConnected, isValidId, toObjectId };
