const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const Car=require('./car')

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
    }
},{
    timestamps:true
})

serviceproviderschema.virtual('car',{
    ref:'Car',
    localField:'_id',
    foreignField:'owner'
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

const Serviceprovider=mongoose.model('Serviceprovider',serviceproviderschema)

module.exports={
    Provider,
    Serviceprovider
}