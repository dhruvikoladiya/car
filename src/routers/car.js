const express=require('express')
const router=new express.Router()
const Car=require('../model/car')
const fs = require('fs');
const multer=require('multer')
const sharp=require('sharp')
const {Provider}=require('../model/provider')
const {Serviceprovider}=require('../model/ser_provider')
const {authuser,authserviceprovider}=require('../middleware/auth')

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)){
            return cb(new Error('Please upload jpg,jpeg,png or pdf file!'))
        }
        cb(undefined,true)
    }
})

router.post('/cardetail',authserviceprovider,upload.fields([{name:'carimage'},{name:'carinsurance'}]),async(req,res)=>{
      
    const car=new Car({ 
        ...req.body,
        carimage:Buffer.from(req.files.carimage[0].buffer).toString('base64'),
        carinsurance:Buffer.from(req.files.carinsurance[0].buffer).toString('base64'),
        owner:req.provider._id 
    })
    if(req.body.carplateno!==(/^[A-Z|a-z]{2}[0-9]{2}[A-Z|a-z]{2}[0-9]{4}$/)){
        return res.status(400).json({error:'not valid plate number!'})
    }
    if(req.body.fueltype!=="petrol"||req.body.fueltype!=="diesel"||req.body.fueltype!=="cng"){
        return res.status(400).json({error:'not valid fueltype!'})
    }
    try{
        await car.save()
        res.status(201).json({car})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.get('/cardetail',authserviceprovider,async(req,res)=>{
    try{
        const car=await Car.find({owner:req.provider._id})
        res.status(200).json({car})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.get('/car',async(req,res)=>{
    try{
        const limit=parseInt(req.query.limit)
        const page=parseInt(req.query.page-1)||0
        const car=await Car.find({}).sort({createdAt:-1}).skip(page*limit).limit(limit)
    
        res.status(200).json({car})
    }catch(e){
        res.status(400).json({error:e})
    }
})

module.exports=router