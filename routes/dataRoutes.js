import express from "express"
const router = express.Router()

import controller from '../controllers/index.js'
const {dataController} = controller;


/////////////////////////////////////////////////
////////////// Connection Requests  /////////////
/////////////////////////////////////////////////
router.post('/connect', dataController.createConnect);
router.post('/connect/:id/accept', dataController.AcceptConnect);
router.post('/connect/:id/decline', dataController.DeclineConnect);
router.get('/connect/requests/:id', dataController.getMyConnectionRequests);
router.get('/connect/proposals/:id', dataController.getMyProposedConnections);


/////////////////////////////////////////////////
//////////////////// Chat  //////////////////////
/////////////////////////////////////////////////
router.post('/chat', dataController.sendChat);
router.get('/chat/:id', dataController.getMyChat);
router.get('/chat/:id/:partnerId', dataController.getOneOneChat);


/////////////////////////////////////////////////
//////////////////// Booking  ///////////////////
/////////////////////////////////////////////////
router.post('/booking', dataController.CreateBooking)
router.get('/booking/:id', dataController.getMyBookings)

export default router;