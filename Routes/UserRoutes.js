const express = require('express');
const router=express.Router();
const{registerUser}=require('../Controllers/UserController')
const {protect}=require('../middlewares/auth')
const{loginUser,Searchuser}=require('../Controllers/UserController')

router.post('/register',registerUser)
router.post('/login',loginUser)

router.get('/:key',protect,Searchuser)

module.exports=router;