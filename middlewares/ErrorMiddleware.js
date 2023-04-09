const notfound=(req,res,next)=>{
    const error=new Error(`Not Found - ${req.originalUrl}`)
res.status(404);
next(error)

}

/*const otherError=(req,res,next)=>{
    const error=new Error(`Not Found - ${originalUrl}`)
res.status(404);
next(error)

}*/


module.exports ={notfound}

