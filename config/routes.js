const express=require('express')
const router=express.Router();

const {usersRouter}=require('../app/controllers/auth')
const {activate} =require('../app/controllers/activate-email')
const {forgotPassword} =require('../app/controllers/forgot-password')
router.use('/users',usersRouter)
router.use('/users',activate)
router.use('/users',forgotPassword)
router.use('/users',forgotPassword)

module.exports={
    routes:router
}