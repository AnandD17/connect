import mongoose  from "mongoose";

const ConnectSchema = mongoose.Schema({
    reqSenderId:{
        type : String,
        required:true
    },
    reqReceiverId:{
        type: String,
        required:true
    },
    time:{
        type: String,
        default: Date.now
    },
    status:{
        type: String,
        enum: ["PENDING", "ACCEPTED", "DECLINED", "EXPIRED"]
    }
},
{
    timestamps:true
})

const Connect = mongoose.model("Connect",ConnectSchema);
export default Connect;