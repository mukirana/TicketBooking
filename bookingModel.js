var mongoose = require('mongoose'); // Install it from Package.json

var bookingSchema = mongoose.Schema({
    date: String,
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
		          bookingTime: String,
		          cancellationTime: String
		        }
		    ]
	     }
    ]
});

module.exports =  mongoose.model('bookings' , bookingSchema);
