const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path'); //for 
var booking = require('./bookingModel.js');
var admin = require('./admin.js')
var MongoClient = require('mongodb').MongoClient;
const Joi = require('joi')

mongoose.connect("mongodb://localhost:27017/TicketBooking")

app.use(bodyParser.json());

// need to pass user info and seat no....
    app.post('/bookTicket',function(req,res){
         
        const{body} = req;
        const bookingSchema= Joi.object().keys({
           seatNo: Joi.number().min(1).max(40).required(),
           name : Joi.string().required(),
           contact : Joi.number().min(1000000000).max(9999999999).required(),
           gender: Joi.string().optional(),
           address: Joi.string().alphanum().required(),
           age: Joi.number().min(1).max(100).required()

        });

        const result = Joi.validate(body, bookingSchema); 
        const { value, error } = result; 
        const valid = error == null; 
        if (!valid) { 
          res.status(422).json({ 
            message: error, 
            data: body 
          }) 
        } else { 

            booking.find({date:"5/4/2020" , 'buses.busId':123},(error,docs)=>{
                var seatNo = req.body.seatNo;
                var ticket = docs[0].buses[0].tickets[seatNo-1];  
                var ticketId = ticket.ticket;
                console.log("ticektId"+ticketId)
                if(ticket.status==true){
                    var response = {message:"This seat is already booked"};
                    res.send(response);
                    return;
                }
                var name = req.body.name ;
                var contact = req.body.contact;
                var age = req.body.age;
                var gender = req.body.gender || null;
                var address = req.body.address;
                var value = `buses.$.tickets.${seatNo-1}.status`
                var newvalues = {$inc: {"buses.$.OpenSeats": -1 }, $set:{[value]:true , [`buses.$.tickets.${seatNo-1}.personDetail`]:{"name":name,"contact":contact,"age":age,"gender":gender,"address":address}}};
                booking.update({date:"5/4/2020", 'buses.busId':123}, newvalues, function(err, doc) {
                           if(err){
                               res.send(err)
                           }
                           else
                           res.send({message:"success",ticketId: ticketId})
                });
  
           });
         
        } 
  
      });

      //for cancel ticket
      // pass ticketId 
      app.post('/cancelTicket',function(req,res){

        const{body} = req;
        const cancelSchema= Joi.object().keys({
           seatNo: Joi.number().min(1).max(40).required(),
           name : Joi.string().required(),
           contact : Joi.number().min(1000000000).max(9999999999).required()
        });

        const result = Joi.validate(body, cancelSchema); 
        const { value, error } = result; 
        const valid = error == null; 

        if (!valid) { 
            res.status(422).json({ 
              message: error, 
              data: body 
            }) 
          } else { 
            booking.find({date:"5/4/2020" , 'buses.busId':123},(error,docs)=>{
                var seatNo = req.body.seatNo;
  
                var ticket = docs[0].buses[0].tickets[seatNo-1];  
                if(ticket.status==false){
                    var response = {message:"It is already canceled"};
                    res.send(response);
                    console.log(ticket.status)
                    return;
                }
               var name = req.body.name;
               var contact = req.body.contact;
               if(ticket.personDetail.name !==name && ticket.personDetail.contact!==contact){
                   var resonse = {message:"Invalid user"}
                   res.send(response);
                   return;
               }
                var value = `buses.$.tickets.${seatNo-1}.status`
                var newvalues = {$inc: {"buses.$.OpenSeats": 1 }, $set:{[value]:false , [`buses.$.tickets.${seatNo-1}.personDetail`]:null}};
                booking.update({date:"5/4/2020", 'buses.busId':123}, newvalues, function(err, doc) {
                           if(err){
                               res.send(err)
                           }
                           else
                           res.send({message: "ticket cancelled sucessfully"})
                });
  
           });         
          }      
      });



      // for adminn need to implement
      app.post('/updateTicket',function(req,res){
        booking.find({date:"5/4/2020"},(error,docs)=>{
           if(docs.length==0){
               admin();
           }
        });
     });

// for testing----------------------------------------------
     app.post('/getSeat',function(req,res){
         const{body} = req;
         const bookingSchema= Joi.object().keys({
            seatNo: Joi.number().min(1).max(40).required(),
         });

         const result = Joi.validate(body, bookingSchema); 
         const { value, error } = result; 
         const valid = error == null; 
         if (!valid) { 
            res.status(422).json({ 
              message: error, 
              data: body 
            }) 
          } else { 
            var seatNo = req.body.seatNo;
            booking.find({date:"5/4/2020", 'buses.busId':123,'buses.tickets.ticket':40},(error,docs)=>{
            var open = docs[0].OpenSeats;
            console.log(docs[0].buses[0].OpenSeats)
            res.send({"seat":open});
            });
          }   
     });


    // to get count of open ticket count
    app.get('/getOpenTicket', function(req,res){
        booking.find({date:"5/4/2020"},(error,docs)=>{
            var buses = docs[0].buses;
            for(var i=0; i<buses.length;i++){
             if(buses[i].busId==123){
                 var openSeats={OpenSeats:buses[i].OpenSeats}
                 res.send(openSeats);
             }  
            }
        });
    });

    // to get total no of closed ticket
    app.get('/getClosedTicket', function(req,res){
        booking.find({date:"5/4/2020"},(error,docs)=>{
             var buses = docs[0].buses;
            for(var i=0; i<buses.length;i++){
             if(buses[i].busId==123){
                 var openSeats={ClosedSeats:40-buses[i].OpenSeats}
                 res.send(openSeats);
             }  
            }
        });
    });

    // to get ticket holder detail
    // input-> ticket-id
    app.get('/ticketHolder/:ticketId', function(req,res){

        const{body} = req.params.ticketId
        const bookingSchema= Joi.object().keys({
            ticketId: Joi.number().min(5).max(10).required(),
         });

         const result = Joi.validate(body, bookingSchema); 
         const { value, error } = result; 
         const valid = error == null; 

         if (!valid) { 
            res.status(422).json({ 
              message: error
            }) 
          } else { 
                booking.find({date:"5/4/2020", 'buses.busId':123},(error,docs)=>{
                    var buses = docs[0].buses[0];
                    for(var i=0; i<buses.tickets.length;i++){
                        if(buses.tickets[i].ticket==req.params.ticketId){
                            var ticketHolderDetail = buses.tickets[i].personDetail;
                           console.log(Object.keys(ticketHolderDetail).length + ticketHolderDetail)
                            if(ticketHolderDetail==null || ticketHolderDetail.name === undefined){
                                res.send({message:"Invalid ticket details.."})
                            }
                            else
                            res.send(buses.tickets[i].personDetail)
                            return;
                        }
                    }
                    res.send({message:"Invalid ticket details.."});

               });
          }          
    });

    // to get ticket status 
    //input ticket-id
    app.get('/ticketStatus/:ticketId', function(req,res){
        const{body} = req.params.ticketId
        const bookingSchema= Joi.object().keys({
            ticketId: Joi.number().min(5).max(10).required(),
         });

         const result = Joi.validate(body, bookingSchema); 
         const { value, error } = result; 
         const valid = error == null; 

         if (!valid) { 
            res.status(422).json({ 
              message: error
            }) 
          } else { 
            booking.find({date:"5/4/2020", 'buses.busId':123},(error,docs)=>{
                var buses = docs[0].buses[0];
                
               for(var i=0; i<buses.tickets.length;i++){
                 if(buses.tickets[i].ticket==req.params.ticketId){
                     res.send({ticketStatus:buses.tickets[i].status})
                 }
               }
           });
          }     
    });
    

const port = 8080;
app.listen(port,()=> {
console.log('listen port 8080')})