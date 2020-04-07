var mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
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
                        type: Schema.Types.ObjectId,
                        ref: 'user'
		           },
		          status: Boolean,
		        }
		    ]
	     }
    ]
});

module.exports =  mongoose.model('bookings' , bookingSchema);
