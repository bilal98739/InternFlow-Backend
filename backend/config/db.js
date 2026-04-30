import mongoose from "mongoose"

const connectDB = async () =>{
    await mongoose.connect("mongodb://localhost:27017/internflow")
    console.log("MongoDB Connected")
}
export default connectDB