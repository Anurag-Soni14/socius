import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username:{
        type:String, 
        required: true, 
        unique: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        default: "",
    },
    bio:{
        type: String,
        default: ""
    },
    gender:{
        type: String,
        enum: ['male','female']
    },
    followers:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    ],
    following:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    post:[
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref:'Post'
        }
    ],
    saved:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Post' 
        }
    ]
},{timestamps: true});
export default User = mongoose.model('User', userSchema);