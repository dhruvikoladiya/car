const express=require('express')
const router=new express.Router()
const {Provider, Serviceprovider}= require('../model/serviceprovider')
const ifsc=require('ifsc')
const {authuser,authserviceprovider}=require('../middleware/auth')
const {sendwelcomeemail,sendresetpasswordemail}=require('../emails/account')
const {User,otptimeouts}=require('../model/user')
const crypto=require('crypto')


router.post('/registerserviceprovider',async(req,res)=>{
    const provider=new Provider(req.body)
    
    if(!req.body.confirmpassword){
        return res.json({message:'Enter confirmpassword value'})
    }
    if(req.body.confirmpassword!==req.body.password){
        return res.json({message:'Password does not match'})
    }
    try{
        await provider.save()
        await sendwelcomeemail(provider.email,provider.firstname)
        const token=await provider.generateAuthToken()
        res.status(201).json({provider,token})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.post('/loginserviceprovider',async(req,res)=>{
    if(!req.body.email){
        return res.status(400).json({error:"Please enter your email!"})
    }
    if(!req.body.password){
        return res.status(400).json({error:"Please enter your password!"})
    }
    try{
        const provider=await Provider.findByCredentials(req.body.email,req.body.password)
        const token=await provider.generateAuthToken()
        res.status(200).json({provider,token})
    }catch(e){
        res.status(400).json({error:"Email and password does not match!"})
    }
})

router.put('/forgotpasswordserviceprovider',async(req,res)=>{

    try{
        const provider =await Provider.findOne({email: req.body.email})
        if(!provider){
            return res.status(400).json({error:'Email is not available!'})
        }
        const num=crypto.randomInt(100000,999999)  
        sendresetpasswordemail(provider.email,num)
        const timeinsecond = Math.floor(Date.now()/1000)
        const time = new otptimeouts({"email":provider.email,"timeout":timeinsecond})
        a = await time.save()
        console.log(a)
        res.json({num})

    }catch(e){
        res.status(400).json({error:e})
    }

})


router.get('/checktimeoutserviceprovider',async(req,res)=>{

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

router.patch('/resetpasswordserviceprovider',async(req,res)=>{
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
   const provider=await Provider.findOne({email:req.body.email})
  
   provider.password=req.body.password
   
   await provider.save()

    res.status(200).json({message:"password has been changed!"})
}catch(e){
    res.status(400).json({error:e})
}
})

router.post('/serviceproviderdetail',authserviceprovider,async(req,res)=>{
    const provider=new Serviceprovider(req.body)
    
    if(req.body.mobileno.length !== 10){
        return res.status(400).json({error:'mobileno must be 10 digits!'}) 
    }

    const ifsccode=ifsc.validate(provider.bankifsccode)
    if(ifsccode===false){
        return res.status(400).json({error:'ifsccode invalid!'})
    }

    if(req.body.adharcardno.length !== 12){
        return res.status(400).json({error:'adharcardno is invalid!'})
    }

    try{
        await provider.save()
        res.status(201).json({provider})
    }catch(e){
        res.status(400).json({error:e})
    }
})

module.exports=router