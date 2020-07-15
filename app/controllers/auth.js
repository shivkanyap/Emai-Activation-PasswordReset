const express=require('express')
const router=express.Router()
const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxebe4b8cee8514cc2b0856482e9d279e2.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
const {User}=require('../modules/user')
const jwt=require('jsonwebtoken')

router.post('/signup',(req,res)=>{
    const body=req.body
    console.log(body,'in body')
    const {username,email,password}=req.body
    User.findOne({email}).exec((err,user)=>{
        if(user)
        {
            return res.status(400).json({error:"User with this email already exists"})
        }
    })

    const token=jwt.sign({username,email,password},process.env.JWT_ACC_ACTIVATE,{expiresIn:'20m'})

    console.log(token,'intoken')
    const data = {
        from: 'norly@hello.com',
        to: email,
        subject: 'Account Activation Link',
        html:`
        <h2>Please click on the link for account activation</h2>
        <p>${process.env.CLIENT_URL}/authentication/activate/${token}</p>
        `
    };
    mg.messages().send(data, function (error, body) {
        if(error)
        {
            return res.json({
                error:err.message
            })
        }
        return res.json({message:'Email has been sent,kindly activate your account'})
        // console.log(body);
    });
  
    const user =new User(body)
    console.log(body)
    user.save()
    .then(user=>res.send(user)) //i can send a messge 
    .catch(err=>res.send(err))
})

module.exports={
    usersRouter:router
}