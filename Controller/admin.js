var booking = require('../bookingModel.js');
const Joi = require('joi')
var serverReset = require('../helper.js')

exports.updateTicket = function(req,res){

    booking.find({date:"5/4/2020"},(error,docs)=>{
        if(docs.length==0){
            serverReset();
            res.send({message:"server is reset"})
        }
        else{
            booking.remove({date:"5/4/2020"},(error,delOk)=>{
                if(error){
                    res.send(error)
                }
                if(delOk){
                 serverReset();
                 res.send({message:"server is reset"})
                }
            });  
        }
     });
}