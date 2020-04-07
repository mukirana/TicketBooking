
var user = require('./userModel.js')
var mongoose = require('mongoose');

var users = function(){
   var person = new user();
   person.name= 'mukesh'
   person.contact = 9898989898
   person.age = 25
   person.gender= 'male'
   person.address='noida'
   person.save(function(err){
       console.log("saved")
       if(err){ 
           throw err
       }
   });

   person = new user();
   person.name= 'akash'
   person.contact = 9898981234
   person.age = 20
   person.gender= 'male'
   person.address='delhi'
   person.save(function(err){
    console.log("saved")
    if(err){ 
        throw err
    }
    });

   person = new user();
   person.name= 'shourya'
   person.contact = 9998981234
   person.age = 22
   person.gender= 'male'
   person.address='bangalore'
   person.save(function(err){
    console.log("saved")
    if(err){ 
        throw err
    }
});

   person = new user();
   person.name= 'ankit'
   person.contact = 9895581234
   person.age = 21
   person.gender= 'male'
   person.address='up'
   person.save(function(err){
    console.log("saved")
    if(err){ 
        throw err
    }
});

   person = new user();
   person.name= 'ashish'
   person.contact = 9898777234
   person.age = 19
   person.gender= 'male'
   person.address='gujrat'
   person.save(function(err){
    console.log("saved")
    if(err){ 
        throw err
    }
});

}
module.exports = users;