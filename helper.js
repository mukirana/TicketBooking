var booking = require('./bookingModel.js');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/TicketBooking")
var run = function(){
    var bus = {};
        bus.tickets =[];
        bus.busId=123;
        bus.OpenSeats = 40;
        for(var i=1;i<=40;i++){
           var ticket ={};
           ticket.seatNo = i;
           ticket.ticket = "5"+"4"+"123"+i;
           ticket.personDetail = null;
           ticket.status = "false";
           bus.tickets.push(ticket);
        }
        
        var doc = {date:"5/4/2020"}
        doc.buses=[];
        doc.buses.push(bus);
        
        booking.insertMany(doc, function(err,res){
            if (err) throw err;
            console.log("Document inserted");
        });
    
}

module.exports = run;