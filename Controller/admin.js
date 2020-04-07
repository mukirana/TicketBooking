var booking = require('../bookingModel.js');
var user = require('../userModel.js')
const Joi = require('joi')
var serverReset = require('../helper.js')
var addUser = require('../addUser.js')
exports.updateTicket = function(req,res){

    booking.find({date:"5/4/2020"},(error,docs)=>{
        if(error){
            res.send(error)
            return;
        }
        if(docs.length==0){
            serverReset();
            res.send({message:"server is reset"})
        }
        else{
            booking.remove({date:"5/4/2020"},(error,delOk)=>{
                if(error){
                    res.send(error)
                    return
                }
                if(delOk){
                 serverReset();
                 res.send({message:"server is reset"})
                }
            });  
        }
     });

}

exports.addUser = function(req,res){
    user.find({},(error,docs)=>{
        if(error){
            res.send(error)
            return;
        }
       if(docs.length==0){
           addUser();
           res.send({message:"users are added"})
           return;
       }
       else{
           res.send({message:"users are already present"})
           return;
       }

    });
}