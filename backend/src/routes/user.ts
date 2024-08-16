import { User } from "../db";
import jwt from 'jsonwebtoken';


const express= require('express');
const router= express.Router();

router.post('/signUp', async (req: any, res: any, next: any) =>{
    
    const password= req.body.password;
    const username= req.body.username;

    const user= await User.create({
        username,
        password
    })

    res.json({
        message: "user created successfully!"
    })
})

router.post('/signIn', async (req: any, res: any, next: any) =>{
    
    const username= req.body.username;
    const password= req.body.password;

   const user= await User.findOne({
        username,
        password
    })

    if(!user){
       return res.json({
            err: "user not found!"
        })
    }
    return res.json({
        message: "user"
    })
})

router.post('/getUsers', async (req: any, res:any, next: any) => {

    const user= req.body.username;
    const regex= new RegExp(user, "i");

    let users= await User.find({
        username: {$regex: regex}
    });

    if(!users){
        res.json({
            msg: "No users found"!
        })
    }

    users= users.map((user:any) =>{
        return user.username;
    });

    res.json({
        users
    })
});

//require("dotenv").config();

module.exports= router;