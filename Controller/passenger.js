var booking = require('../bookingModel.js');
const Joi = require('joi')

exports.bookTicket = function(req,res){          
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
}

exports.cancelTicket = function(req,res){
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
}


exports.getOpenTicket = function(req,res){
    booking.find({date:"5/4/2020"},(error,docs)=>{
        if(error){
            res.send(error);
            return;
        }
        var buses = docs[0].buses;
        for(var i=0; i<buses.length;i++){
         if(buses[i].busId==123){
             var openSeats={OpenSeats:buses[i].OpenSeats}
             res.send(openSeats);
             return;
         }  
        }
        res.send({message:"wrong bus Id"})
    });
}

exports.getClosedTicket = function(req,res){
    booking.find({date:"5/4/2020"},(error,docs)=>{
        if(error){
            res.send(error);
            return;
        }
        var buses = docs[0].buses;
       for(var i=0; i<buses.length;i++){
        if(buses[i].busId==123){
            var openSeats={ClosedSeats:40-buses[i].OpenSeats}
            res.send(openSeats);
            return;
        }  
       }
       res.send({message:"wrong bus Id"})
   });
}

exports.ticketHolder = function(req,res){
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
                if(error){
                    res.send(error);
                    return;
                }
                var buses = docs[0].buses[0];
                for(var i=0; i<buses.tickets.length;i++){
                    if(buses.tickets[i].ticket==req.params.ticketId){
                        var ticketHolderDetail = buses.tickets[i].personDetail;                          
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
}

exports.ticketStatus=  function(req,res){
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
            if(error){
                res.send(error);
                return;
            }
            var buses = docs[0].buses[0];
            
           for(var i=0; i<buses.tickets.length;i++){
             if(buses.tickets[i].ticket==req.params.ticketId){
                 res.send({ticketStatus:buses.tickets[i].status})
                 return;
             }
           }
           res.send({message:"wrong ticket Id.."})
       });
      }    
}