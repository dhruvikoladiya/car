const mongoose=require('mongoose')
const Car=require('./car')
const Provider=require('./provider')

const serviceproviderschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    mobileno:{
        type:Number,
        required:true,
        trim:true,
        unique:true
    },
    city:{
        type:String,
        required:true
    },
    zipcode:{
        type:Number,
        required:true
    },
    bankname:{
        type:String,
        required:true,
        trim:true
    },
    bankaccountno:{
        type:Number,
        required:true,
        trim:true,
        unique:true,
        minlength:9,
        maxlength:18
    },
    bankifsccode:{
        type:String,
        required:true
    },
    adharcardno:{
        type:Number,
        required:true,
        trim:true,
        unique:true  
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Provider'
    }
},{
    timestamps:true
})

serviceproviderschema.virtual('car',{
    ref:'Car',
    localField:'_id',
    foreignField:'owner'
})

const Serviceprovider=mongoose.model('Serviceprovider',serviceproviderschema)

module.exports={
    Serviceprovider
}