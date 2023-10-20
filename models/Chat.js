import mongoose  from "mongoose";

const ChatSchema = mongoose.Schema({
    senderId:{
        type : String,
        required:true
    },
    receiverId:{
        type: String,
        required:true
    },
    message: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum:["ACTIVE","INACTIVE"]
    }
},
{
    timestamps:true
})

const Chat = mongoose.model("Chat",ChatSchema);
export default Chat;