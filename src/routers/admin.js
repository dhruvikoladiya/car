const express=require('express')
const router=new express.Router()
const Admin=require('../model/admin')

router.post('/registeradmin',async(req,res)=>{
    const admin=new Admin(req.body)
    res.send(req.body)
    try{
        await admin.save()
        res.status(201).json({admin})
    }catch(e){
        res.status(400).json({error:e})
    } 
})

router.post('/loginadmin',async(req,res)=>{

    try{
        const admin=await Admin.findByCredentials(req.body.id,req.body.password)
        res.status(200).json({message:"Login successfully"})
    }catch(e){
        res.status(400).json({error:"Email and password does not match!"})
    }
})

module.exports=router