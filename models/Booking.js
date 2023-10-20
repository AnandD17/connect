import mongoose  from "mongoose";

const BookingSchema = mongoose.Schema({
    orgId:{
        type : String,
        required:true
    },
    inviteeId:{
        type: String,
        required:true
    },
    venue: {
        type: String,
        required: true
    },
    time: {
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

const Booking = mongoose.model("Booking",BookingSchema);
export default Booking;