const express=require('express')
require('./db/mongoose')
const User=require('./model/user')
const userrouter=require('./routers/user')

const app=express()
const port=process.env.PORT

app.use(express.json())
app.use(userrouter)

app.listen(port,()=>{
    console.log('Server is up on '+port)
})