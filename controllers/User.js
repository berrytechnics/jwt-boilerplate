import jwt from 'jsonwebtoken'
import bCrypt from 'bcryptjs'
import User from '../models/User.js'
export default {
    validateToken:req=>{
        return new Promise((resolve,reject)=>{
            if(req.headers&&req.headers.authorization){
                let authorization = req.headers.authorization
                let decoded
                try{
                    decoded = jwt.verify(authorization,process.env.JWT_SECRET) 
                }
                catch(err){
                    reject('Token not valid')
                }
                let userId = decoded.id 
                User
                    .findById(userId)
                    .then(user=>{resolve({_id:user._id,username:user.username})})
                    .catch(e=>reject('Token Error: '+e))
            }
            else reject('No token found')
        })
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