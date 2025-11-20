import mongoose from 'mongoose';

async function connectDB(){
    try{
        const db=mongoose.connect("mongodb://127.0.0.1:27017/todoNew");
        console.log("Connected to MongoDB");

    }catch(error){
        console.log("Error connecting to MongoDB:",error);

    }

}

export default connectDB;