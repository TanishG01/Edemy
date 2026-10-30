import mongoose from "mongoose";

// connect to the MongoDB database

const connectDB = async ()=>{
   mongoose.connection.on('connected', ()=> console.log('Database Connected'))

   const connectionString = process.env.MONGODB_URI
   if (!connectionString) {
      throw new Error('MONGODB_URI is not configured')
   }

   await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
   })
}
export default connectDB