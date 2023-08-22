import Jwt  from "jsonwebtoken";
import UserModel from "../models/user.js";
import { model } from "mongoose";

var checkUserAuth = async (req,res,next) => {
    //get token from header
    let token;
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try {
            token = authorization.split(' ')[1];

            // verify token

            const {user_ID} = Jwt.verify(token, process.env.JWT_SECRET_KEY) 

            // get user from token
            req.user = await UserModel.findById(user_ID).select("-password")
            next()
        } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Unauthorized User" })
        }
    }
    if(!token){
        res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
    }
}

export default checkUserAuth;