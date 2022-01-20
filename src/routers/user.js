const express=require('express')
const router=new express.Router()
const jwt=require('jsonwebtoken')
const {User,otptimeouts}=require('../model/user')
const {sendwelcomeemail,sendresetpasswordemail}=require('../emails/account')
const crypto=require('crypto')
const auth=require('../middleware/auth')


router.post('/register',async(req,res)=>{
    const user=new User(req.body)
    if(!req.body.confirmpassword){
        return res.json({message:'Enter confirmpassword value'})
    }
    if(req.body.confirmpassword!==req.body.password){
        return res.json({message:'Password does not match'})
    }
    try{
        await user.save()
        await sendwelcomeemail(user.email,user.firstname)
        const token=await user.generateAuthToken()
        res.status(201).json({user,token})
    }catch(e){
        res.status(400).json({error:e})
    } 
})

router.post('/login',async(req,res)=>{

    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.status(200).json({user,token})
    }catch(e){
        res.status(400).json({error:"Email and password does not match!"})
    }
})

router.put('/forgotpassword',async(req,res)=>{

        try{
            const user =await User.findOne({email: req.body.email})
            if(!user){
                return res.status(400).json({error:'Email is not available!'})
            }
            const num=crypto.randomInt(100000,999999)  
            sendresetpasswordemail(user.email,num)
            const timeinsecond = Math.floor(Date.now()/1000)
            const time = new otptimeouts({"email":user.email,"timeout":timeinsecond})
            a = await time.save()
            console.log(a)
            res.json({num})

        }catch(e){
            res.status(400).json({error:e})
        }

})


router.get('/checktimeout',async(req,res)=>{

    try{
        const time = await otptimeouts.findOne({email:req.body.email}).sort({timeout:-1})
        //res.send('ok')
        const timeinsecond = Math.floor(Date.now()/1000)
        if (timeinsecond - time.timeout > 120){
            res.json({message:"OTP EXPIRED!!!"})
        }
        else{
            res.json({message:"SUCCESSFUL!!!"})
        }
    }
    catch(e){
        res.status(400).json({error:e})
    }

})

router.patch('/resetpassword',async(req,res)=>{
    if(!req.body.password || req.body.password.length < 7){
        return res.status(404).json({error:"Password is not Entered!"})
    }
    if(!req.body.confirmpassword){
        return res.status(404).json({error:"ConfirmPassword is not Entered!"})
    }
    if(req.body.confirmpassword!==req.body.password){
        return res.json({message:'Password does not match'})
    }
    
    try{
       const user=await User.findOne({email:req.body.email})
      
       user.password=req.body.password
       
       await user.save()

        res.status(200).json({message:"password has been changed!"})
    }catch(e){
        res.status(400).json({error:e})
    }
})



module.exports=router