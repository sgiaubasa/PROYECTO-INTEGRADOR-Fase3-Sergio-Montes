// backend/src/config/mongoose.config.js
import mongoose from "mongoose";

let cached = global._mongooseCached;
if (!cached) cached = (global._mongooseCached = { conn: null, promise: null, ok: false });

export async function connectDB() {
  // Acepta ambos nombres de variables por si uno u otro está configurado
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.MONGODB_DB || process.env.MONGO_DB_NAME;

  if (!uri) {
    console.warn("[DB] MONGODB_URI/MONGO_URI no está definido");
    cached.ok = false;
    return null;
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set("bufferCommands", false);
    mongoose.set("strictQuery", true);

    const opts = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
      ...(dbName ? { dbName } : {}),
    };

    console.log("[DB] Conectando a MongoDB…");
    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        const { name, host } = m.connection;
        console.log("[DB] OK:", { host, db: name });
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

// ✅ Mantener estas exportaciones con nombre (las usa product.service.js)
export function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

export function toObjectId(id) {
  if (!isValidId(id)) throw new Error("ID de Mongo inválido");
  return new mongoose.Types.ObjectId(String(id));
}

// Export default opcional (no rompe las importaciones con nombre)
export default { connectDB, isDBConnected, isValidId, toObjectId };


