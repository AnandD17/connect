import Booking from '../models/Booking.js';
import Chat from '../models/Chat.js';
import Connect from '../models/Connect.js'


/////////////////////////////////////////////////
////////////// Connection Requests  /////////////
/////////////////////////////////////////////////

///Create Connection
/**
 * [This Function Creates a new connection request between two users]
 */
export const createConnect = async (req, res) => {
    const { reqSenderId, reqReceiverId } = req.body;

    if(!reqSenderId || !reqReceiverId) return res.status(400).json({message: "Bad Request"});

    const spec = {
        reqReceiverId,
        reqSenderId,
        status: "PENDING",
        time: new Date().getTime(),
    }

    const preCheckConnection = await Connect.find({
        $or: [
          {
            reqReceiverId: reqSenderId,
            reqSenderId: reqReceiverId,
          },
          {
            reqReceiverId: reqReceiverId,
            reqSenderId: reqSenderId,
          },
        ],
        status:{
            $in:["PENDING", "ACCEPTED"]
        }
      });

    if(preCheckConnection.length !== 0) return res.status(409).json({message: "Connect Request Already Exists", data: preCheckConnection});

    console.log(spec);
    try{
        // const newConnect = await Connect.create(spec);
        const newConnect = await Connect.create(spec);
        res.status(201).json(newConnect);
    }
    catch(err){
        console.log(`Error in creating new connect request :: ${err}`);
        res.status(500).json({message: "Internal Server Error"});
    }

}

///Accept Connection
/**
    * [This Function Accepts a connection request between two users]
 */
export const AcceptConnect = async (req, res) => {
    const { id } = req.params;

    const spec = {
        status: "ACCEPTED",
        time: new Date().getTime(),
    }

    try{
        const updatedConnect = await Connect.findByIdAndUpdate(id, spec);
        if(!updatedConnect) return res.status(404).json({message: "Connect Request Not Found"});
        else res.status(200).json({data:updatedConnect, message:"Connect Request Accepted"});
    }
    catch(err){
        console.log(`Error in accepting connect request :: ${err}`);
        res.status(500).json({message: "Internal Server Error"});
    }

}

///Decline Connection
/**
    * [This Function Declines a connection request between two users]
*/

export const DeclineConnect = async (req, res) => {
    const { id } = req.params;

    const spec = {
        status: "DECLINED",
        time: new Date().getTime(),
    }

    try{
        const updatedConnect = await Connect.findByIdAndUpdate(id, spec);
        if(!updatedConnect) return res.status(404).json({message: "Connect Request Not Found"});
        else res.status(200).json({data:updatedConnect, message:"Connect Request Declined"});
    }
    catch(err){
        console.log(`Error in accepting connect request :: ${err}`);
        res.status(500).json({message: "Internal Server Error"});
    }

}

///Check Connection Expiry
/**
    * [This Function Checks for expired connection requests and updates them]
 */
export const CheckConnectExpiry = async (req, res) => {

    const pDay = new Date().getTime();
    const hour = 24;
    const previousDay = pDay - hour * 60 * 60 * 1000
    console.log(previousDay);
    
    const filter = {
        time: {$lte: previousDay},
        $or:[
            {
                status: "PENDING",
            },
            {
                status: "ACCEPTED",
            },
        ]
    };
    console.log(filter);
  
    // Define the update operation
    const update = {
        $set: {
            status:"EXPIRED",
            time: new Date().getTime(),
        },
    };
    try {
        const updateConnect = await Connect.updateMany(filter, update);
        // const updateConnect = await Connect.find(filter);
        // if(!updateConnect) console.log(`Connect Request Not Updated`);
        console.log(`Connect Request Updated :: ${updateConnect}`);
    } catch (error) {
        console.log(`Error in accepting connect request :: ${err}`);
    }
}

///Get My Connection Requests
/**
 * [This Function Gets all the connection requests for a user]
 */
export const getMyConnectionRequests = async (req, res) => {
    const {id} = req.params;

    const filter = {
        reqReceiverId: id,
        status: "PENDING",
    };

    try{
        const myConnectionRequests = await Connect.find(filter);
        return res.status(200).json(myConnectionRequests);
    }
    catch(err){
        console.log(`Error in getting my connection requests :: ${err}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}

///Get My Proposed Connections
/**
 * [This Function Gets all the connection requests proposed by a user]
 */
export const getMyProposedConnections = async (req, res) => {
    const {id} = req.params;

    const filter = {
        reqSenderId: id,
        status: "PENDING",
    };

    try{
        const myConnectionProposals = await Connect.find(filter);
        return res.status(200).json(myConnectionProposals);
    }
    catch(err){
        console.log(`Error in getting my connection requests :: ${err}`);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




/////////////////////////////////////////////////
//////////////////// Chat  //////////////////////
/////////////////////////////////////////////////

///Send Chat
/**
 * [This Function Sends a new chat between two users]
 */
export const sendChat = async (req, res) => {
    const { senderId, receiverId, message } = req.body;

    if(!senderId || !receiverId || !message) return res.status(400).json({message: "Bad Request"});

    const Connectquery = {
        $or: [
          {
            reqReceiverId: senderId,
            reqSenderId: receiverId,
          },
          {
            reqReceiverId: receiverId,
            reqSenderId: senderId,
          },
        ],
        status: "ACCEPTED",
      };
      
          

    const CheckConnect = await Connect.find(Connectquery);

    if(CheckConnect.length === 0) return res.status(404).json({message: "Connect Request Not Found"});

    const spec = {
        senderId,
        receiverId,
        message,
        status: "ACTIVE"
    }

    try{
        const newChat = await Chat.create(spec);
        return res.status(201).json(newChat);
    }
    catch(err){
        console.log(`Error in sending new chat :: ${err}`);
        return res.status(500).json({message: "Internal Server Error"});
    }

}


///Get My Chat
/**
 * [This Function Gets all the chats for a user]
 */
export const getMyChat = async (req, res) => {
    const {id} = req.params;

    const filter = {
        $or: [
            {
                senderId: id,
            },
            {
                receiverId: id,
            },
        ],
        status: "ACTIVE",
    };


    try{
        const myChat = await Chat.find(filter);
        return res.status(200).json(myChat);
    }
    catch(err){
        console.log(`Error in getting my chat :: ${err}`);
        return res.status(500).json({message: "Internal Server Error"});
    }

}

///Get One to One Chat
/**
 * [This Function Gets all the chats between two users]
 */
export const getOneOneChat = async (req, res) => {
    const {id, partnerId} = req.params;

    const filter = {
        $or: [
            {
                senderId: id,
                receiverId: partnerId,
            },
            {
                receiverId: id,
                senderId: partnerId,
            },
        ],
        status: "ACTIVE",
    };


    try{
        const myChat = await Chat.find(filter);
        return res.status(200).json(myChat);
    }
    catch(err){
        console.log(`Error in getting my chat :: ${err}`);
        return res.status(500).json({message: "Internal Server Error"});
    }

}

/////////////////////////////////////////////////
//////////////////// Booking  ///////////////////
/////////////////////////////////////////////////

///Create Booking
/**
 * [This Function Creates a new booking between two users]
 */
export const CreateBooking = async (req, res) => {
    const { orgId, inviteeId, venue, time } = req.body;

    if(!orgId || !inviteeId || !venue || !time) return res.status(400).json({message: "Bad Request"});

    const Connectquery = {
        $or: [
          {
            reqReceiverId: orgId,
            reqSenderId: inviteeId,
          },
          {
            reqReceiverId: inviteeId,
            reqSenderId: orgId,
          },
        ],
        status: "ACCEPTED",
      };
      
          

    const CheckConnect = await Connect.find(Connectquery);

    if(CheckConnect.length === 0) return res.status(404).json({message: "Connect Request Not Found"});

    const spec = {
        orgId,
        inviteeId,
        venue,
        time,
        status: "ACTIVE"
    }

    try{
        const newBooking = await Booking.create(spec);
        return res.status(201).json(newBooking);
    }
    catch(err){
        console.log(`Error in Creating New Booking :: ${err}`);
        return res.status(500).json({message: "Internal Server Error"});
    }

}

///Get My Bookings
/**
 * [This Function Gets all the bookings for a user]
 */
export const getMyBookings = async (req, res) => {
    const {id} = req.params;

    const filter = {
        $or: [
            {
                orgId: id,
            },
            {
                inviteeId: id,
            },
        ],
        status: "ACTIVE",
    };


    try{
        const myBookings = await Booking.find(filter);
        return res.status(200).json(myBookings);
    }
    catch(err){
        console.log(`Error in getting my bookings :: ${err}`);
        return res.status(500).json({message: "Internal Server Error"});
    }

}