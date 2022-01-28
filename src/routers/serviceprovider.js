const express=require('express')
const router=new express.Router()
const {Provider}= require('../model/provider')
const {Serviceprovider}=require('../model/ser_provider')
const {authuser,authserviceprovider}=require('../middleware/auth')
const {sendwelcomeemail,sendresetpasswordemail,sendcancelemail}=require('../emails/account')
const {User,otptimeouts}=require('../model/user')
const crypto=require('crypto')
const Car = require('../model/car')


router.post('/registerprovider',async(req,res)=>{
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

router.post('/loginprovider',async(req,res)=>{
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

router.post('/addserviceproviderdetail',authserviceprovider,async(req,res)=>{
    const provider=new Serviceprovider({
        ...req.body,
        owner:req.provider._id
    })    
    
    if(req.body.mobileno.length !== 10){
        return res.status(400).json({error:'mobileno must be 10 digits!'}) 
    }

    if(req.body.adharcardno.length !== 12){
        return res.status(400).json({error:'adharcardno is invalid!'})
    }

    if(!req.body.bankifsccode.match(/^[A-Za-z]{4}\d{7}$/)){
        return res.status(400).json({error:'ifsccode is invalid!'})
    }
    try{
        await provider.save()
        res.status(201).json({provider})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.get('/serviceproviderdetail',authserviceprovider,async(req,res)=>{
    try{
        const provider=await Serviceprovider.findOne({owner:req.provider._id})
        res.status(200).json({provider})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.patch('/updateproviderdetail',authserviceprovider,async(req,res)=>{
    try{
        //const user =await User.findById(req.user._id) 
        updates.forEach((update)=>req.user[update]=req.body[update])

        await req.user.save()

        //const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!user){
        //     res.status(404).send()
        // }
        res.status(200).json({user:req.user})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.post('/logoutprovider',authserviceprovider,async(req,res)=>{
    try{
        req.provider.tokens=req.provider.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.provider.save()
        res.status(200).json({})
    }catch(e){
        res.status(500).json({})
    }
})

router.delete('/deleteprovider',authserviceprovider,async(req,res)=>{

    try{
        await req.provider.remove()
        await Serviceprovider.findOneAndDelete({owner:req.provider._id})
        await Car.findOneAndDelete({owner:req.provider._id})
        sendcancelemail(req.provider.email,req.provider.name)
        res.status(200).json({provider:req.provider})
    }catch(e){
        res.status(400).json({error:e})
    }
})

module.exports=router