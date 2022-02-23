const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Userdetail=require('./userdetail')

const userschema=new mongoose.Schema({
    firstname:{
        type:String,
        trim:true,
        required:true
    },
    lastname:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password:{
        type:String,
        trim:true,
        minlength:8,
        required:true,
        validate(value){
            if(value.toLowerCase().includes('Password')){
                throw new Error('Password must not contain word password')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})

userschema.virtual('userdetail',{
    ref:'Userdetail',
    localField:'_id',
    foreignField:'owner'
})

userschema.virtual('order',{
    ref:'Order',
    localField:'_id',
    foreignField:'userid'
})

const otpschema=new mongoose.Schema({
    email:{
        type:String,
        Required:true,
        trim:true,
        lowercase:true
    },
    timeout:{
        type:Number   
    }
},{
    timestamps:true
})

userschema.methods.toJSON=function(){
    const user=this
    const userobject=user.toObject()    

    delete userobject.password
    delete userobject.tokens

    return userobject
}


userschema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

userschema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({ email })
    if(!user){
        throw new Error('Email is not valid!')
    }

    const ismatch=await bcrypt.compare(password,user.password)
    if(!ismatch){
        throw new Error('Wrong password!')
    } 
    return user
}



userschema.pre('save',async function(next){
    const user=this

    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }

    next()
})

const User=mongoose.model('User',userschema)

const otptimeouts=mongoose.model('otptimeouts',otpschema)

module.exports={
    User,
    otptimeouts
}