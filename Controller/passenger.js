var booking = require('../bookingModel.js');
var user = require('../userModel.js')
const Joi = require('joi')

exports.bookTicket =  function(req,res){          
    const{body} = req;
    const bookingSchema= Joi.object().keys({
       seatNo: Joi.number().min(1).max(40).required(),
       name : Joi.string().required(),
       contact : Joi.number().min(1000000000).max(9999999999).required()

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
            if(docs==null || docs==undefined || docs[0]===undefined){
                res.send({message:"bus not present"})
                return;
            }
            var ticket = docs[0].buses[0].tickets[seatNo-1];  
            var ticketId = ticket.ticket;
            if(ticket.status==true){
                var response = {message:"This seat is already booked"};
                res.send(response);
                return;
            }
            var name = req.body.name ;
            var contact = req.body.contact;
            var value = `buses.$.tickets.${seatNo-1}.status`
            user.find({name:name,contact:contact},(error,data)=>{
                 if(error){
                     res.send(error)
                     return;
                 }
               
                 if(data===null || data===undefined || data[0]===undefined){
                    res.send({message:"Invalid user"})
                    return;
                 }
                

                 var newvalues = {$inc: {"buses.$.OpenSeats": -1 }, $set:{[value]:true , [`buses.$.tickets.${seatNo-1}.personDetail`]:data[0]._id}};
                 booking.update({date:"5/4/2020", 'buses.busId':123}, newvalues, function(err, doc) {
                    if(err){
                        res.send(err)
                    }
                    else
                    res.send({message:"success",ticketId: ticketId})
                });

                //  res.send(docs)
                //  return;
            })

           
           

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
                if(error){
                    res.send(error);
                    return;
                }
                var seatNo = req.body.seatNo;
                if(docs==null || docs==undefined || docs[0]===undefined){
                    res.send({message:"bus not present"})
                    return;
                }
                var ticket = docs[0].buses[0].tickets[seatNo-1];  
                if(ticket.status==false){
                    var response = {message:"It is already canceled"};
                    res.send(response);
                   // console.log(ticket.status)
                    return;
                }
               var name = req.body.name;
               var contact = req.body.contact;
               user.find({name:name,contact:contact},(error,data)=>{
                if(error){
                    res.send(error)
                    return;
                }
              
                if(data===null || data===undefined || data[0]===undefined || !data[0]._id.equals(ticket.personDetail)){
                  //  console.log(data[0]._id!=ticket.personDetail)
                   res.send({message:"Invalid user"})
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
              
               //  res.send(docs)
               //  return;
           })
  
           });         
          }   
}


exports.getOpenTicket = function(req,res){
    booking.find({date:"5/4/2020"},(error,docs)=>{
        if(error){
            res.send(error);
            return;
        }
        if(docs==null || docs==undefined || docs[0]===undefined){
            res.send({message:"bus not present"})
            return;
        }
        var buses = docs[0].buses;
        for(var i=0; i<buses.length;i++){
         if(buses[i].busId==123){
            
             var openTickets =[];
             
             for(var ticket=0;ticket<40;ticket++){
                // console.log(buses[i].tickets[ticket].status)
                 if(buses[i].tickets[ticket].status===false){
                     openTickets.push({seatNo:buses[i].tickets[ticket].seatNo})
                 }
             }
             var openSeats={OpenSeatsCount:buses[i].OpenSeats,TicketNo:openTickets}
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
      //  console.log(docs[0])
        if(docs==null || docs==undefined || docs[0]===undefined){
            res.send({message:"bus not present"})
            return;
        }
     //   console.log(docs[0].buses)
        var buses = docs[0].buses;
        
       for(var i=0; i<buses.length;i++){
        if(buses[i].busId==123){
            var closeTickets =[];
             
             for(var ticket=0;ticket<40;ticket++){
              //   console.log(buses[i].tickets[ticket].status)
                 if(buses[i].tickets[ticket].status===true){
                     closeTickets.push({seatNo:buses[i].tickets[ticket].seatNo})
                 }
             }
             var tickets={ClosedSeatsCount:40-buses[i].OpenSeats,TicketNo:closeTickets}
             res.send(tickets);
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
                if(docs==null || docs==undefined || docs[0]===undefined){
                    res.send({message:"bus not present"})
                    return;
                }
                var buses = docs[0].buses[0];
                for(var i=0; i<buses.tickets.length;i++){
                    if(buses.tickets[i].ticket==req.params.ticketId){
                        var ticketHolderDetail = buses.tickets[i].personDetail;                          
                        if(ticketHolderDetail==null){
                          //  console.log(ticketHolderDetail)
                            res.send({message:"Invalid ticket details...."})
                            return;
                        }
                        else{
                            const ticketId = buses.tickets[i].personDetail;
                         //   console.log(ticketId)
                            user.find({_id:[ticketId]},(err,data)=>{
                                if(err){
                                    res.send(error)
                                    return
                                }
                                if(data==null || data==undefined){
                                    res.send({message:"No data present"})
                                    return
                                }
                                else{
                                  res.send(data)
                                }
                            })
                            return
                        }

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
            if(docs==null || docs==undefined || docs[0]===undefined){
                res.send({message:"bus not present"})
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