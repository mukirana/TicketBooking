const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path'); //for 
var bookingModel = require('./bookingModel.js');
var MongoClient = require('mongodb').MongoClient;


mongoose.connect("mongodb://localhost:27017/TicketBooking")
// , function (err, db) {
    
//     db.collection('booking', function (err, collection) {
        
//         collection.insert({ id: 1, firstName: 'Steve', lastName: 'Jobs' });
//         collection.insert({ id: 2, firstName: 'Bill', lastName: 'Gates' });
//         collection.insert({ id: 3, firstName: 'James', lastName: 'Bond' });
        
//         db.collection('booking').count(function (err, count) {
//             if (err) throw err;
            
//             console.log('Total Rows: ' + count);
//         });
//     });
                
// });



app.use(bodyParser.json());
app.get('/hello_world', (req,res)=>{
    res.send('Hello World');
    })


    app.post('/post',function(req,res){
        var booking = new bookingModel();
        booking.date = req.body.date
        booking.save(function(err,savedObject){
            if(savedObject)
            {
              res.send(booking)
            }
            else {
              res.send(err);
            }
     });
      });
    

const port = 8080;
app.listen(port,()=> {
console.log('listen port 8000')})