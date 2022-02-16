const mongoose=require('mongoose')
const validator=require('validator')

const orderschema=new mongoose.Schema({
   orderid:{
        type:String,
        unique:true,
        required:true
    }, 
    carid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Car'
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    transactionid:{
        type:String,
        required:true,
        unique:true
    },
    agentid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Provider'
    },
    carimage:{
        required:true,
        type:String
    },
    carname:{
        required:true,
        type:String
    },
    carno:{
        type:String,
        required:true,
        ref:'Car'
    },
    city:{
        required:true,
        type:String     
    },
    checkindate:{
        required:true,
        type:String
    },
    checkoutdate:{
        required:true,
        type:String
    },
    username:{
        required:true,
        type:String
    },
    agentname:{
        required:true,
        type:String
    },
    transmissiontype:{
        type:String,
        required:true
    }
})

const Order=mongoose.model('Order',orderschema)

module.exports=Order