import mongoose from "mongoose";

export const database = ()=>{
    mongoose.connect(process.env.DB).then(
        console.log("db is connected")
    )
}