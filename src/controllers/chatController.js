const chat = require('../models/chat')
const message = require('../models/message')
const {Chat,User}=require('./../models')
const {Op, where}=require("sequelize")

const getAllChatsOfUser=async(req,res,next)=>{
    try {
        const chats=await Chat.findAll({
            where:{
                [Op.or]:{
                    // TODO:here getting the user id from auth middleware should be impleted
                    userOne:req.params.id,
                    userTwo:req.params.id
                }
            }
        })
        if(chats){
            return res.status(200).json({success:true,message:"Successfully fetched all chats",data:chats})
        }else{
            return res.status(200).json({success:false,message:"No chats found",data:[]
    })
        }
    } catch (error) {
        console.log(error);
    }
}

const createChat=async(req,res,next)=>{
    try {
        const chat=await Chat.create({
            name:req.body.name?req.body.name:"",
            // TODO:here getting the user id from auth middleware should be impleted
            userOne:req.params.id,
            userTwo:req.body.participantId,
            lastMessageId:0
        })
        if(chat){
            return res.status(200).json({success:true,message:"Successfully created the chat",data:chat})
        }else{
            return res.status(200).json({success:false,message:"Error while creating a chat"})
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteChat=async(req,res,next)=>{
    try {
        const chat=await Chat.findByPk(req.params.id);
        if(chat){
            await chat.destroy();
            return res.status(200).json({success:true,message:"Successfully deleted the chat"})
        }else{
            return res.status(404).json({success:false,message:"No chat found with the given id"})
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports={
    getAllChatsOfUser,
    createChat,
    deleteChat
}