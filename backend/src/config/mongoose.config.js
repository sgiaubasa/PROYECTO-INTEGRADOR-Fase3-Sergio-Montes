// backend/src/config/mongoose.config.js
import mongoose from "mongoose";

let cached = global._mongooseCached;
if (!cached) cached = global._mongooseCached = { conn: null, promise: null, ok: false };

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI; // <- acepta ambos
  const dbName = process.env.MONGODB_DB || process.env.MONGO_DB_NAME; // opcional

  if (!uri) {
    console.warn("[DB] MONGODB_URI/MONGO_URI no está definido");
    cached.ok = false;
    return null;
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    mongoose.set("bufferCommands", false);
    mongoose.set("strictQuery", true);
    const opts = { serverSelectionTimeoutMS: 10000, socketTimeoutMS: 20000 };
    if (dbName) opts.dbName = dbName; // <- usa la DB correcta

    console.log("[DB] Conectando a MongoDB…");
    cached.promise = mongoose.connect(uri, opts)
      .then((m) => { 
        const { name, host } = m.connection;
        console.log("[DB] OK:", { host, db: name }); // loguea la DB efectiva
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

