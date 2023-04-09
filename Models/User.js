const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userModel=mongoose.Schema({

    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    avatar:{type:String,default:'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png'},
  
   
   

},{

    timestamps:true,
})
//user model custom methods

userModel.methods.matchpass=async function(pass){
return await bcrypt.compare(pass,this.password)
}




// custom methods ends
userModel.pre("save",async function(next){
let user=this
    if (!this.isModified) {
  next();        
    }
    //create new salt
    const salt=await bcrypt.genSalt(10);
    //hash passcode
    this.password=await bcrypt.hash(this.password,salt)
})

const User=mongoose.model("User",userModel);

module.exports=User;

//name
//chat_id
//sender

