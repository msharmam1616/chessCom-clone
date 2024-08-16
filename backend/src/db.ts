import { mongo, Mongoose,Schema } from "mongoose";

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mohit:mohit123@cluster0.1s8klrl.mongodb.net/chessComClone?retryWrites=true&w=majority')
.then(()=>{
    console.log("connection Successful!");
})

const userSchema= mongoose.Schema({
    username: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
})

export const User= mongoose.model('User', userSchema);