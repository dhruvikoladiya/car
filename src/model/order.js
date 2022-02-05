const mongoose=require('mongoose')
const validator=require('validator')

const orderschema=new mongoose.Schema({
    transactionid:{
        type:String,
        default:"",
        unique:true,
    },
    carid:{
        type:mongoose.Schema.Types.ObjectId,
        default:"",
        ref:'Car'
    },
    carno:{
        type:String,
        default:"",
        ref:'Car'
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        default:"",
        ref:'User'
    },
    providerid:{
        type:mongoose.Schema.Types.ObjectId,
        default:"",
        ref:'Provider'
    },
    username:{
        default:"",
        type:String
    },
    agentname:{
        default:"",
        type:String
    },
    carname:{
        default:"",
        type:String
    },
    checkindate:{
        default:"",
        type:String
    },
    checkoutdate:{
        default:"",
        type:String
    },
    city:{
        default:"",
        type:String     
    },
    status:{
        default:"",
        type:String
    }
})

const Order=mongoose.model('Order',orderschema)

module.exports=Order