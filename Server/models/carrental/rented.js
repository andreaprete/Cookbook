let mongoose = require('mongoose');


module.exports = rentedSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,required:true},
    name:{type:String,required:true},
    date:{type:Number,required:true},
    price:{type:Number,required:true},
});

//const rentedModel = mongoose.model('rented',rentedSchema);

//module.exports = rentedModel;

