"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mohit:mohit123@cluster0.1s8klrl.mongodb.net/chessComClone?retryWrites=true&w=majority')
    .then(() => {
    console.log("connection Successful!");
});
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    }
});
exports.User = mongoose.model('User', userSchema);
