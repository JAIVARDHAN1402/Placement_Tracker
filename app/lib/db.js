import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { autoIndex: false }).then(async (mongoose) => {
      console.log('✅ MongoDB Connected');
      // Drop stale email_1 unique index if it exists (left over from old schema)
      try {
        await mongoose.connection.collection('users').dropIndex('email_1');
        console.log('🧹 Dropped stale email_1 index');
      } catch (_) {
        // Index doesn't exist — nothing to do
      }
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;