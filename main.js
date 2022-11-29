import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import User from './controllers/User.js'
const app = express()
app.use(bodyParser.json())

app.all('/',(req,res)=>res.json({message:"Server is running"}))
app.post('/register',(req,res)=>{
    User.register(req,res)
})
app.post('/login',(req,res)=>{
    User.login(req,res)
})
app.all('/user',User.auth,(req,res)=>{
    res.json({message:"User Authorized"})
})
app.use((err,req,res,next)=>err?next(err):res.json({error:'An unknown error occurred'}))
app.use((err,req,res)=>res.json({error:err}))
mongoose.connect(process.env.MONGO_URI)
app.listen(process.env.PORT,()=>{
    console.log(`Listening on ${process.env.PORT}`)
})