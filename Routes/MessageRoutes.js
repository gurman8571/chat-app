const express = require('express');
const router=express.Router();
const {protect}=require('../middlewares/auth')
const{allmessages}=require('../Controllers/MessageController')
const{message}=require('../Controllers/MessageController')


router.post('/',protect,message)
router.get('/:chatId',protect,allmessages)
//router.post('/create/groupChat',protect,createGp)
//router.put('/rename/group',protect,renamegp)
//router.put('/remove/user/group',protect,removefromgp)
//router.put('/add/user/group',protect,addtogp)



module.exports=router;