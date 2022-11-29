import mongoose from 'mongoose'
mongoose.connect(process.env.MONGO_URI)
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    }
})
export const User = mongoose.model('User',userSchema)
