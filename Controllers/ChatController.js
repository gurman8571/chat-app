const User=require('../Models/User')
const jwt=require('jsonwebtoken')
const Chat=require('../Models/Chat')
const mongoose = require('mongoose');



const index=async(req,res)=>{
    const { userId } = req.body;

    if (!userId) {
      //console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
  
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
  
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });
  
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
}

const fetchchats=async(req,res)=>{
var data=await Chat.find(
  
  
  {$or:[{users:{$elemMatch:{$eq:req.user._id}}},{
       
groupAdmin:req.user._id


  }]}).populate("users","-password").populate("groupAdmin","-password").populate("latestMessage")
.sort({updatedAt:-1})
;
data = await User.populate(data, {
  path: "latestMessage.sender",
  select: "name avatar email",
});

return res.send({chats:data})

}

const createGp=async(req,res)=>{
if (!req.body.users||!req.body.name) {
return  res.status(400).send({'Errmsg':'Pleae fill all details'}) 
}

var users=JSON.parse(req.body.users)
if (users.length<2) {
  return  res.status(400).send({'Errmsg':'Group chat should have 2 or  more than 2 users'}) 
}
var chatData = {
  chatName: req.body.name,
  isGroupChat: true,
  users: users,
  groupAdmin: req.user,
};
//const createdChat = await Chat.create(chatData);
try {
  const createdChat = await Chat.create(chatData);
  const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
    "users",
    "-password"
  ).populate("groupAdmin", "-password");
  res.status(200).json(FullChat);
} catch (error) {
  res.status(400);
  throw new Error(error.message);
}
   
}

const renamegp= async(req,res)=>{

  
  const updatedChat= await Chat.findByIdAndUpdate(

    req.body.chatId,
    {
      chatName: req.body.name,
    },
    {
      new: true,
    }
  ).populate("users", "-password")
  .populate("groupAdmin", "-password");

  
  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
}

const removefromgp=async(req,res)=>{
const chatId=req.body.chatId;
const userId=req.body.userId;

const removed = await Chat.findByIdAndUpdate(
  chatId, { $pull: { users: userId },},{new: true,}
)
  .populate("users", "-password")
  .populate("groupAdmin", "-password");

if (!removed) {
  res.status(404);
  throw new Error("Chat Not Found");
} else {
  res.json(removed);
}
}
const addtogp=async(req,res)=>{
  const chatId=req.body.chatId;
  const userId=req.body.userId;
  
  const removed = await Chat.findByIdAndUpdate(
    chatId, { $push: { users: userId },},{new: true,}
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  
  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
  }

   
module.exports ={index,fetchchats,createGp,renamegp,addtogp,removefromgp}