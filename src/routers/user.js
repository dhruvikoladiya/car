const express=require('express')
const router=new express.Router()
const User=require('../model/user')
const {sendwelcomeemail}=require('../emails/account')

router.post('/register',async(req,res)=>{
    const user=new User(req.body)
    if(!req.body.confirmpassword){
        return res.send(' Enter confirmpassword value')
    }
    if(req.body.confirmpassword!==req.body.password){
        return res.send('Password does not match')
    }
    try{
        await user.save()
        sendwelcomeemail(user.email,user.firstname)
        const token=await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    } 
})

router.post('/login',async(req,res)=>{

    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports=router