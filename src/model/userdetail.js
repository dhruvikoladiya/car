const mongoose=require('mongoose')
const validator =require('validator')

const userdetailschema=new mongoose.Schema({
    gender:{
        required:true,
        type:String
    },
    phnno:{
        required:true,
        type:Number
    },
    panno:{
        required:true,
        type:String
    },
    dlno:{
        required:true,
        type:String
    },
    city:{
        required:true,
        type:String
    },
    pincode:{
        required:true,
        type:Number
    },
    address:{
        required:true,
        type:String
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})

const Userdetail=mongoose.model('Userdetail',userdetailschema)

module.exports=Userdetail