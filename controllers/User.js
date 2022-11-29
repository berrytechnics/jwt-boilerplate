import jwt from 'jsonwebtoken'
import bCrypt from 'bcryptjs'
import User from '../models/User.js'
export default {
    auth:async(req,res,next)=>{
        if(!req.headers||!req.headers.authorization) res.json({error:'Token not received'})
        let authorization = req.headers.authorization
        let decoded
        try{
            decoded = jwt.verify(authorization,process.env.JWT_SECRET)
        }
        catch(err){res.json({error:err})}
        let userID = decoded.id
        try{
            await User.findById(userID)
            next()
        }
        catch(err){res.json({error:err})}
    },
    register:async (req,res)=>{
        try{
            let user
            if(!req.body.username||!req.body.password) res.json({error:"Missing Parameters"})
            user = await User.findOne({username:req.body.username})
            if(user) res.json({error:'User already exists'})
            user = await User.create({username:req.body.username,password:bCrypt.hashSync(req.body.password,10)})
            const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET)
            res.json({user:user.username,token:token})
        }
        catch(err){res.json({error:err})}
    },
    login:async(req,res)=>{
        try{
            let user
            if(!req.body.username||!req.body.password) res.json({error:"Missing Parameters"})
            user = await User.findOne({username:req.body.username})
            if(!user) res.json({error:"User not found"})
            else{
                if(!bCrypt.compareSync(req.body.password,user.password)) res.json({error:"Wrong Username or Password"})
                else{
                    const token = jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET)
                    res.json({user:user.username,token:token})
                }
            }

        }
        catch(err){res.json({error:err})}
    }
}