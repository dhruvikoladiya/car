const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const Car=require('./car')
const {Serviceprovider}=require('./ser_provider')

const providerschema=new mongoose.Schema({
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
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
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

providerschema.virtual('ser_provider',{
    ref:'Serviceprovider',
    localField:'_id',
    foreignField:'owner'
})

providerschema.virtual('order',{
    ref:'Order',
    localField:'_id',
    foreignField:'providerid'
})

providerschema.methods.toJSON=function(){
    const provider=this
    const providerobject=provider.toObject()    

    delete providerobject.password
    delete providerobject.tokens
    
    return providerobject
}

providerschema.methods.generateAuthToken=async function(){
    const provider=this
    const token=jwt.sign({_id:provider._id.toString()},process.env.JWT_SECRET)

    provider.tokens=provider.tokens.concat({token})
    await provider.save()
    return token
}

providerschema.statics.findByCredentials=async(email,password)=>{
    const provider=await Provider.findOne({ email })
    if(!provider){
        throw new Error('Email is not valid!')
    }

    const ismatch=await bcrypt.compare(password,provider.password)
    if(!ismatch){
        throw new Error('Wrong password!')
    } 
    return provider
}

providerschema.pre('save',async function(next){
    const provider=this

    if(provider.isModified('password')){
        provider.password=await bcrypt.hash(provider.password,8)
    }

    next()
})

const Provider=mongoose.model('Provider',providerschema)

module.exports={
    Provider
}