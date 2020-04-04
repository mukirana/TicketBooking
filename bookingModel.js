var mongoose = require('mongoose'); // Install it from Package.json

var bookingSchema = mongoose.Schema({
    id: Number,
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

var booking = mongoose.model('bookingmodel' , bookingSchema);

module.exports = booking; 