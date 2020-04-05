const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path'); //for 
var booking = require('./bookingModel.js');
var admin = require('./admin.js')
var MongoClient = require('mongodb').MongoClient;


mongoose.connect("mongodb://localhost:27017/TicketBooking")

app.use(bodyParser.json());
app.get('/hello_world', (req,res)=>{
    res.send('Hello World');
    })


    app.post('/post',function(req,res){
        admin();
         booking.find({date:"5/4/2021"},(error,docs)=>{
              res.send(docs);
         });
      });


    app.get('/getOpenTicket', function(req,res){
        booking.find({date:"5/4/2021"},(error,docs)=>{
             var buses = docs[0].buses;
           //  res.send(buses)
            for(var i=0; i<buses.length;i++){
             if(buses[i].busId==123){
                 var openSeats={OpenSeats:buses[i].OpenSeats}
                 res.send(openSeats);
             }  
            }
        });
    });

    app.get('/getClosedTicket', function(req,res){
        booking.find({date:"5/4/2021"},(error,docs)=>{
             var buses = docs[0].buses;
            for(var i=0; i<buses.length;i++){
             if(buses[i].busId==123){
                 var openSeats={ClosedSeats:40-buses[i].OpenSeats}
                 res.send(openSeats);
             }  
            }
        });
    });

    app.get('/ticketHolder/:ticketId', function(req,res){
        booking.find({date:"5/4/2021", 'buses.busId':123},(error,docs)=>{
            // res.send(docs);
             var buses = docs[0].buses[0];

           //  res.send({len:buses.tickets.length});
            for(var i=0; i<buses.tickets.length;i++){
              if(buses.tickets[i].ticket==req.params.ticketId){
                  res.send(buses.tickets[i].personDetail)
              }
            }
        });
    });
    

const port = 8080;
app.listen(port,()=> {
console.log('listen port 8080')})