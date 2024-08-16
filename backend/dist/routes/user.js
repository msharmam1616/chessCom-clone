"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const express = require('express');
const router = express.Router();
router.post('/signUp', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const password = req.body.password;
    const username = req.body.username;
    const user = yield db_1.User.create({
        username,
        password
    });
    res.json({
        message: "user created successfully!"
    });
}));
router.post('/signIn', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const user = yield db_1.User.findOne({
        username,
        password
    });
    if (!user) {
        return res.json({
            err: "user not found!"
        });
    }
    return res.json({
        message: "user"
    });
}));
router.post('/getUsers', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body.username;
    const regex = new RegExp(user, "i");
    let users = yield db_1.User.find({
        username: { $regex: regex }
    });
    if (!users) {
        res.json({
            msg: "No users found"
        });
    }
    users = users.map((user) => {
        return user.username;
    });
    res.json({
        users
    });
}));
//require("dotenv").config();
module.exports = router;
