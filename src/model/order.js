const mongoose=require('mongoose')
const validator=require('validator')
const autoIncrement=require('mongoose-auto-increment')

const orderschema=new mongoose.Schema({
    transactionid:{
        type:String,
        required:true,
        unique:true,
    },
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    providerid:{
        type:mongoose.Schema.Types.ObjectId,
        
        ref:'Provider'
    },
    username:{
        required:true,
        type:String
    },
    agentname:{
        
        type:String
    },
    carname:{
        
        type:String
    },
    checkindate:{
        
        type:Date
    },
    checkoutdate:{
        
        type:Date
    },
    pickupaddress:{
        
        type:String
    },
    dropoffaddress:{
        
        type:String
    },
    city:{
        
        type:String     
    },
    status:{
        
        type:String
    }
})

// autoIncrement.initialize(mongoose.connection)
// orderschema.plugin(autoIncrement.plugin,{
//     model:'Order',
//     field:'transactionid',
//     startAt:1,
//     incrementBy:1
// })


const Order=mongoose.model('Order',orderschema)

module.exports=Order