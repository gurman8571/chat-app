const User=require('../Models/User')
const jwt=require('jsonwebtoken')
const Chat=require('../Models/Chat')
const mongoose = require('mongoose');
const Message=require('../Models/Message')

const message=async(req,res)=>{
    const {chatId,content}=req.body;
    
    
    if (!chatId) {
       res.status(400);
       return res.send({'msg':'please fill  chatid'}); 
    }
    
    if (!content) {
        res.status(400);
        return res.send({'msg':'please enter a mesage'}); 
     }
    var chatData = {
        chat: chatId ,
        sender:req.user._id,
        content:content ,
      };
    

    try {
        var message= await Message.create(chatData);
        message=await message.populate("sender","name avatar");
        message=await message.populate("chat");
        //populating user data in chat
             message=await User.populate(message,{
                path:"chat.users",
                select:"name avatar email"


                
    })

    await Chat.findByIdAndUpdate(chatId,{
        latestMessage:message,
         
    })
        res.json(message);
    } catch (error) {
        throw new Error(error.message)
        
    }
   
    
     
    }

    const allmessages=async(req,res)=>{
      
       try {
        const messages=await Message.find({chat:req.params.chatId}).populate("sender","name avatar email").populate("chat");
        res.json(messages);
       } catch (error) {
        throw new Error(error.message)
       }


    }

module.exports ={message,allmessages}