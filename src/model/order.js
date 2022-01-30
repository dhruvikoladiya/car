const mongoose=require('mongoose')
const validator=require('validator')

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
        required:true,
        ref:'Provider'
    },
    username:{
        required:true,
        type:String
    },
    agentname:{
        required:true,
        type:String
    },
    carname:{
        required:true,
        type:String
    },
    checkindate:{
        required:true,
        type:Date
    },
    checkoutdate:{
        required:true,
        type:Date
    },
    pickupaddress:{
        required:true,
        type:String
    },
    dropoffaddress:{
        required:true,
        type:String
    },
    city:{
        required:true,
        type:String     
    },
    status:{
        required:true,
        type:String
    }
})

// db.counters.insert({
//     _id:'transactionid',
//     seq:0
// })
    
orderschema.methods.gensequence=async function(name){
    const order=this
    
    var ret = db.counters.findAndModify(
        {
          query: { _id: name },
          update: { $inc: { seq: 1 } },
          new: true
        }
 );

 return ret.seq;
}

const Order=mongoose.model('Order',orderschema)

module.exports=Order