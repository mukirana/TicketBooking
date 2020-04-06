const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path'); //for 
var booking = require('./bookingModel.js');
var MongoClient = require('mongodb').MongoClient;
const Joi = require('joi')


mongoose.connect("mongodb://localhost:27017/TicketBooking")

app.use(bodyParser.json());

// require controller module
var passenger = require('./Controller/passenger');
var admin = require('./Controller/admin')

    // for ticket booking
    // input-> passengerName ,contact, age ,address ,gender(optional), seatNo(1-40)
    app.post('/bookTicket',passenger.bookTicket);

    //for cancelling the  ticket
    //input-> ticketId(integer) passengerName and contact_no  5412339
     app.post('/cancelTicket',passenger.cancelTicket);

    // to get count of open ticket count
    app.get('/getOpenTicket', passenger.getOpenTicket)

    // to get total no of closed ticket
    app.get('/getClosedTicket', passenger.getClosedTicket)

    // to get ticket holder detail
    // input-> ticket-id
    app.get('/ticketHolder/:ticketId', passenger.ticketHolder)

    // to get ticket status 
    //input ticket-id
    app.get('/ticketStatus/:ticketId',passenger.ticketStatus)

    // Admin api for resetting the server
     app.post('/updateTicket',admin.updateTicket)


const port = 8080;
app.listen(port,()=> {
console.log('listen port 8080')})