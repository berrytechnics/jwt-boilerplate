import jwt from 'jsonwebtoken'
import {User} from './db.js'
export default function(req){
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
}