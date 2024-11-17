const { where } = require("sequelize");
const message = require("../models/message");
const {User,RefreshToken}=require("./../models")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const login=async(req,res,next)=>{
    try {
        const user=await User.findOne({
            where:{
                email:req.body.email
            }
        })
        if(!user){
            return res.status(404).json({success:false,message:"No user found"})
        }else{
            const validPassword=bcrypt.compareSync(req.body.password,user.password);
            if(!validPassword){
                return res.status(401).json({success:false,message:"Not a valid password"})
                
            }else{
                const jwttoken=await jwt.sign({id:user.id},"secretissecret",{
                    expiresIn:"12hr"
                });
                res.cookie("token",jwttoken,{httpOnly:true ,secure:true,sameSite:'none'})
                
                res.status(200).cookie("token",jwttoken,{httpOnly:true ,secure:true,sameSite:'none'}).json({success:true,message:"Logged in Successfully",data:{token:jwttoken}}).send();
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Error occured"})
    }
}

const register=async(req,res,next)=>{
    try {
        const userExists=await User.findOne({
            where:{
                email:req.body.email
            }
        })
        if(userExists){
            return res.status(400).json({success:false,message:"User already Existing"})
        }else{
            const user=await User.create({
                ...req.body,
                password:bcrypt.hashSync(req.body.password,10)
            })
            if(user){
                return res.status(200).json({success:true,message:"Successfully Registered the user",data:user})
            }else{
        return res.status(400).json({success:false,message:"Error occured while signing up"})

            }
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Error occured"})
    }
}

const getUserByToken=async(req,res,next)=>{
    try {
        const token=req.cookies.token;
        if(!token && req.headers.authorization){
            console.log("token not found in cookies");
            token=req.headers['authorization'].split(" ")[1];
            // token=req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return res.status(401).json({success:false,message:"No login token found"})
        }
        const {id}=jwt.verify(token,"secretissecret");
        if(!id){
            return res.status(401).json({success:false,message:"No User found.Not a valid token"})
        }
        const user=await User.findByPk(id);
        if(!user){
            return res.status(401).json({success:false,message:"No user found"})
        }

        return res.status(200).json({success:true,message:"Successfully fetched the user details",data:user})
    } catch (error) {
        console.log(error);
    }
}

module.exports={
    login,
    register,
    getUserByToken
}