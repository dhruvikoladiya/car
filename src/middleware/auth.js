const jwt=require('jsonwebtoken')
const {User,otptimeouts}=require('../model/user')
const {Provider}=require('../model/provider')
const {Serviceprovider}=require('../model/ser_provider')

const authuser=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})

        if(!user){
            throw new Error()
        }

        req.token=token
        req.user=user
        next()
    }catch(e){
        res.status(401).json({message:"Please Authenticate."})
    }
}

const authserviceprovider=async (req,res,next)=>{
    try{
        console.log(req.header)
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token, process.env.JWT_SECRET)
        const provider=await Provider.findOne({_id:decoded._id,'tokens.token':token})
       
        if(!provider){
            throw new Error()
        }

        req.token=token
        req.provider=provider
        next()
    }catch(e){
        res.status(401).json({message:"Please Authenticate."})
    }
}

module.exports={
    authuser,
    authserviceprovider
}