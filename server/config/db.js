import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log('Connecting to:', process.env.MONGO_URI) // 👈 debug line
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
