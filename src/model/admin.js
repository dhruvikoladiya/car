const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const adminschema=new mongoose.Schema({
    id:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    }
},{
    timestamps:true
})

adminschema.pre('save',async function(next){
    const admin=this

    if(admin.isModified('password')){
        admin.password=await bcrypt.hash(admin.password,8)
    }

    next()
})

adminschema.statics.findByCredentials=async(id,password)=>{
    const admin=await Admin.findOne({ id })
    if(!admin){
        throw new Error('id is invalid!')
    }

    const ismatch=await bcrypt.compare(password,admin.password)
    if(!ismatch){
        throw new Error('Wrong password!')
    } 
    return admin
}

const Admin=mongoose.model('Admin',adminschema)

module.exports=Admin