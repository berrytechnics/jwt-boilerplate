import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
mongoose.Promise = global.Promise
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import bCrypt from 'bcryptjs'
import {User} from './db.js'
import validateToken from './userFromToken.js'
const app = express()
app.use(bodyParser.json())

app.post('/register',(req,res)=>{
    !req.body.username||!req.body.password ? res.json({error:'Missing parameters!'}):null
    User.create({
        username:req.body.username,
        password:bCrypt.hashSync(req.body.password,10)
    }).then(user=>{
        const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET)
        res.json({token:token})
    }).catch(err=>res.json({error:err}))
})
app.post('/login',(req,res)=>{
    !req.body.username||!req.body.password ? res.json({error:"Missing Parameters!"}) : null
    User.findOne({username:req.body.username}).then(user=>{
        if(!user) res.json({error:"User not found!"})
        else{
            if(!bCrypt.compareSync(req.body.password,user.password)) res.json({error:'Wrong password!'})
            else {
                const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET)
                res.json({token:token})
            }
        }

    }).catch(err=>res.json({error:err}))
})
app.post('/user',async(req,res)=>{
    try{
        const user = await validateToken(req)
        res.json(user)
    }
    catch(e){
        res.json({error:e})
    }
})

app.use((err,req,res,next)=>err?next(err):res.status(500).send('An unknown error occurred!'))
app.use((err,req,res)=>res.status(400).send(new Error(err)))
app.listen(process.env.PORT,()=>{
    console.log(`Listening on ${process.env.PORT}`)
})