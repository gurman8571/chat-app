const mongoose = require('mongoose')
const chatModel=mongoose.Schema({

    chatName: {type:String},
    isGroupChat: {type:Boolean,default:false},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage:{type:mongoose.Schema.Types.ObjectId,

      ref:"Message"},
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true 
})

const chat=mongoose.model("Chat",chatModel);

module.exports=chat;

//chatname
//users
//isGroup
//latestmesage
//admin_id
