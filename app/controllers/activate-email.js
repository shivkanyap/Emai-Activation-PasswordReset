const express=require('express')
const router=express.Router()
const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxebe4b8cee8514cc2b0856482e9d279e2.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
const {User}=require('../modules/user')
const jwt=require('jsonwebtoken')

router.post('/activate',(req,res)=>{
    const body=req.body
    const {token}=req.body;
    if(token)
    {
        jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function(err,decodedtoken){
            if(err)
            {
                return res.status(400).json({error:'Incorrect or expired Linked'})
            }
            const {name,email,password}=decodedtoken
            User.findOne({email}).exec((err,user)=>{
                if(user)
                {
                    return res.status(400).json({error:"User with this email already exists"})
                }
                const usera =new User(body)
                 console.log(body)
                usera.save()
                    .then(usera=>res.send(user)) //i can send a messge 
                     .catch(err=>res.send('signup success'))
            })
            

        })
        
    }
    else{
        return res.json({error:"something went wrong"})
    }
})
module.exports={
    activate:router
}