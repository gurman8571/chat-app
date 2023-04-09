const express = require('express');
const router=express.Router();
const {protect}=require('../middlewares/auth')
const {index}=require('../Controllers/ChatController')
const {fetchchats}=require('../Controllers/ChatController')
const{createGp}=require('../Controllers/ChatController')
const{renamegp}=require('../Controllers/ChatController')
const{removefromgp}=require('../Controllers/ChatController')
const{addtogp}=require('../Controllers/ChatController')


router.post('/',protect,index)
router.get('/chats',protect,fetchchats)
router.post('/create/groupChat',protect,createGp)
router.put('/rename/group',protect,renamegp)
router.put('/remove/user/group',protect,removefromgp)
router.put('/add/user/group',protect,addtogp)



module.exports=router;