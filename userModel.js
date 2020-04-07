var mongoose = require('mongoose'); 

var userSchema = mongoose.Schema({
        name: String,
        contact: Number,
        age: Number,
        gender: String,
        address: String
})
userSchema.index({"name": 1, "contact": 1 }, { unique : true });
module.exports =  mongoose.model('user', userSchema);