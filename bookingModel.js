var mongoose = require('mongoose'); // Install it from Package.json

var bookingSchema = mongoose.Schema({
    date: {type: String, index:true},
    buses:
    [
	      {   
	      	busId: Number,
	      	OpenSeats : Number,
		    tickets: [
		    	{
		          seatNo: Number,
		          ticket: Number,
		          personDetail: 
		            {
		                name: String,
		                contact: Number,
		                age: Number,
		                gender: String,
		                address: String
		           },
		          status: Boolean,
		        }
		    ]
	     }
    ]
});

module.exports =  mongoose.model('bookings' , bookingSchema);
