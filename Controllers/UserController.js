

const User=require('../Models/User')
const jwt=require('jsonwebtoken')
const generateToken=(id)=>{
return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"300d"})

}

const registerUser=async(req,res)=>{

const {name,email,password,avatar}=req.body;

//const name="gurman";
//const email="gurma381@gmail.com"
//const password="Amritsar12"

if (!name||!email||!password) {
     res.status(400);
    return  res.send({ErrorMsg:'Please fill mandatory feilds'})
}
 else{

    const userexist=await User.findOne({

        email
     })
    
     if (userexist) {
        res.status(400);
        return  res.send({ErrorMsg:'User already exist'})  
     }

     else{

const result=   await User.create({

            name,email,password
        });

        if (result) {
     res.status(200)       

     return res.send({

        data:{

            _id: result._id,
            name: result.name,
            email: result.email,
            avatar: result.avatar,
            token:generateToken(result._id),
        }
    
    
    });
        }
        else{
            return  res.send({ErrorMsg:'Internal error'})  
        }
     }
 }

}
const loginUser=async(req,res)=>{
const {email,password}=req.body;

const result=await User.findOne({ email});
if (!result) {
    res.status(400)
    return res.send({ErrorMsg:'User not exists'})  
}
else{
   if (await result.matchpass(password)) {
    return res.send({

        data:{

            _id: result._id,
            name: result.name,
            email: result.email,
            avatar: result.avatar,
            token:generateToken(result._id),
        }
    
    
    });
   }
   else{
    res.status(400);
    return  res.send({ErrorMsg:'Password is incorrect'})  
   }

}

}
const Searchuser=async(req,res)=>{
const keyword= req.params.key?{

    "$or":[
        {"name":{$regex:req.params.key}},
        {"email":{$regex:req.params.key}}
    ],
}:{};

let data=await User.find(keyword).find({_id:{$ne:req.user._id}});
return res.send({users:data})
}


module.exports ={registerUser,loginUser,Searchuser}