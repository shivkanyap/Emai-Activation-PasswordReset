const express=require('express')
const router=express.Router()
const {User}=require('../modules/user')
const jwt=require('jsonwebtoken')
const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxebe4b8cee8514cc2b0856482e9d279e2.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
const _=require('lodash')

router.put('/forgot-password',(req,res)=>{
    const {email}=req.body;
    User.findOne({email},(err,user)=>{
        if(err || !user)
        {
            return res.status(400).json({error:"User with this email does not  exists"})

        }
        const token=jwt.sign({_id:user._id},process.env.RESET_PASSWORD_KEY,{expiresIn:'20m'})

        console.log(token,'intoken')
        const data = {
        from: 'norly@hello.com',
        to: email,
        subject: 'Account Activation Link',
        html:`
        <h2><a>Please click on the link to reset your password</a></h2>
        <p><a>${process.env.CLIENT_URL}/resetpassword/${token}</a></p>
        `
    };
    return user.updateOne({ resetLink: token}, function(err, success) {
        if(err || !user)
        {
            return res.status(400).json({error:"User with this email does not  exists"})

        }
        else{
            mg.messages().send(data, function (error, body) {
                if(error)
                {
                    return res.json({
                        error:err.message
                    })
                }
                return res.json({message:'Email has been sent,kindly reset your password '})
                // console.log(body);
            });

        }

    });
    })

})
router.put('/reset-password',(req,res)=>{
    const {resetLink,newPass}=req.body
    if(resetLink){
        jwt.verify(resetLink,process.env.RESET_PASSWORD_KEY,(error,decodedData)=>{
            if(error){
                return res.status(401).json({
                    error:"Incorrect token or it is expired"
                })
            }
            User.findOne({resetLink},(err,user)=>{
                if(err||!user)
                {
                    return res.status(400).json({error:"User with this token does not  exists"})
                }
                const obj={
                    password:newPass,
                    resetLink:''
                }
                user=_.extend(user,obj)
                user.save((err,result)=>{
                    if(err)
                    {
                        return res.status(400).json({error:"reset password error"})
                    }
                    else{
                        return res.status(200).json({error:"Your password had been changed"})
                    }
                })
            })
        })

    }
    else{
        return res.status(401).json({error:"Aunthentication error!!"})
    }
})
    


module.exports={
    forgotPassword:router
}