const express=require('express')
const router=new express.Router()
const jwt=require('jsonwebtoken')
const {User,otptimeouts}=require('../model/user')
const {sendwelcomeemail,sendresetpasswordemail,sendcancelemail}=require('../emails/account')
const crypto=require('crypto')
const {authuser,authserviceprovider}=require('../middleware/auth')
const Userdetail=require('../model/userdetail')
const Order=require('../model/order')
const { Provider } = require('../model/provider')
const Car = require('../model/car')
const moment=require('moment')
const fs=require('fs')

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

router.get('/user',async(req,res)=>{

    try{
        const limit=parseInt(req.query.limit)
        const page=parseInt(req.query.page-1)||0
        const user=await User.find({}).sort({createdAt:-1}).skip(page*limit).limit(limit)
    
        res.status(200).json({user})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.post('/adduserdetail',authuser,async(req,res)=>{
    const user=await new Userdetail({
        ...req.body,
        owner:req.user._id
    })
    if(req.body.phnno.length!==10){
        return res.json({error:'phnno is invalid!'})
    }
    if(!req.body.pincode.match(/^[1-9][0-9]{5}$/)){
        return res.status(400).json({error:'pincode is invalid!'})
    }
    if(!req.body.panno.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)){
        return res.status(400).json({error:'panno is invalid!'})
    }
    try{
        await user.save()
        res.status(201).json({user})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.get('/userdetail',async(req,res)=>{
    try{
        const limit=parseInt(req.query.limit)
        const page=parseInt(req.query.page-1)||0
        const user=await Userdetail.find({}).sort({createdAt:-1}).skip(page*limit).limit(limit)
    
        res.status(200).json({user})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.patch('/updateuserprofile',authuser,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedtasks=['firstname','lastname','password']
    const validoperations=updates.every((update)=>allowedtasks.includes(update))

    if(!validoperations){
        res.json({error:"invalid updates"})
    }
    try{     
        const user=await User.findOne({email:req.user.email}) 
    
        updates.forEach((update)=>user[update]=req.body[update])

        await user.save()   
        res.status(200).json({user})
    }catch(e){
        res.status(400).json({error:e})
    }
})

router.post('/logoutuser',authuser,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).json({})
    }catch(e){
        res.status(500).json({})
    }
})

router.delete('/deleteuser',authuser,async(req,res)=>{

    try{
        await req.user.remove()
        await Userdetail.findOneAndDelete({owner:req.user._id})
        sendcancelemail(req.user.email,req.user.name)
        res.status(200).json({user:req.user})
    }catch(e){
        res.status(400).json({})
    }
})

// router.post('/createorder',async(req,res)=>{
//     let date_ob = new Date('2022-02-01 17:19:9');
//     let da=new Date('2022-02-04 17:19:9')
//     const order=new Order({
//         // userid:req.user._id,
//         // username:req.user.name,
//         checkindate:date_ob,
//         checkoutdate:da
//     })
    
//     try{
//         res.send(order)
//         //await order.save()
//         res.status(201).json({order})
//     }catch(e){
//         res.status(400).json({error:e})
//     }
// })  

router.get('/checkstatus',authuser,async(req,res)=>{
    var carArray = []
    const checkin=req.body.checkindate
    const checkout=req.body.checkoutdate

    const cindate= moment(checkin).format('YYYY/MM/DD hh:mm:ss')
    const coutdate= moment(checkout).format('YYYY/MM/DD hh:mm:ss')
    
    const car=await Car.find({city:req.body.city}, {carplateno:1}) 
    for (let c of car){
        
        var flag = true
        const order=await Order.find({carno:c.carplateno},{transactionid:1,checkindate:1,checkoutdate:1})
        for(let b of order){
            
            const startdate= moment(b.checkindate).format('YYYY/MM/DD hh:mm:ss')
            const enddate= moment(b.checkoutdate).format('YYYY/MM/DD hh:mm:ss')

            if (moment(cindate).isBetween(startdate, enddate) || 
                moment(cindate).isSame(startdate) ||
                moment(cindate).isSame(enddate) ||
                moment(coutdate).isBetween(startdate, enddate) || 
                moment(coutdate).isSame(startdate) ||
                moment(coutdate).isSame(enddate) ){
                    flag = false
            }
        }
        if (flag == true){
            carArray.push(c.carplateno)
        }
    }
    console.log(carArray)

    try{
        var carList = []
        for(let i of carArray){
            var car1= new Car()
            //console.log(i)
            car1=await Car.find({carplateno:i})
            //console.log(car1)
            carList.push(car1)
        }
        //console.log(carList)
        res.status(200).json(JSON.parse(JSON.stringify(carList)))
    }catch(e){
        res.status(400).json({error:e})
    }
}) 

module.exports=router