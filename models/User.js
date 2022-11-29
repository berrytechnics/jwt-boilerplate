import mongoose from 'mongoose'
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
export default mongoose.model('User',userSchema)