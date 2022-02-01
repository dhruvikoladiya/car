const mongoose=require('mongoose')
const validator=require('validator')
//const {Provider,Serviceprovider}=require('./serviceprovider')

const carschema=new mongoose.Schema({
    carname:{
        type:String,
        required:true
    },
    carimage:{
        type:Buffer,
        required:true   
    },
    carplateno:{
        type:String,
        required:true,
        unique:true
    },
    carpickupaddress:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    cardropaddress:{
        type:String,
        required:true
    },
    cartype:{
        type:String,
        required:true
    },
    fueltype:{
        type:String,
        required:true
    },
    transmissiontype:{
        type:String,
        required:true
    },
    baggage:{
        type:Number,
        required:true
    },
    seater:{
        type:Number,
        required:true
    },
    carinsurance:{
        type:Buffer,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Serviceprovider'
    },
},{
    timestamps:true
})

const Car=mongoose.model('Car',carschema)

module.exports=Car