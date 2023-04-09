const jwt=require('jsonwebtoken')
const User=require("../Models/User")

const protect=async(req,res,next)=>{

    let token;
    //che k token present or not
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        
        try {

            //decode token

            //remove barer word  from token
             token = req.headers.authorization.split(' ')[1];
            //verify token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            req.user= await User.findById(decodedToken.id).select("-password")

next();
            //const userId = decodedToken.userId;
        } catch (error) {
        res.status(401);
        throw new Error(error);    
        }
    }

if(!token)    
   {
    res.status(401);
    return res.send('Please provide token');  
   }    
    }
module.exports={protect}