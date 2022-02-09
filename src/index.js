const express=require('express')
require('./db/mongoose')
const User=require('./model/user')
const userrouter=require('./routers/user')
const servicerouter=require('./routers/serviceprovider')
const carrouter=require('./routers/car')
const cors=require('cors')

const app=express()
const port=process.env.PORT

var corsOptions = {
    origin: 'http://localhost:3000/*',
    optionsSuccessStatus: 200,
    methods: "GET, PUT, POST, PATCH, DELETE"
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(userrouter)
app.use(servicerouter)
app.use(carrouter)


app.listen(port,()=>{
    console.log('Server is up on '+port)
})