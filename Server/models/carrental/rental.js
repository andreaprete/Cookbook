let mongoose = require('mongoose');
let Rented = require("./rented");

let rentalSchema = new mongoose.Schema({
    cartype:{type:mongoose.Schema.Types.ObjectId,required:true},
    owner:{type:mongoose.Schema.Types.ObjectId,required:true},
    price:{type:Number,required:true},
    brand:{type:String,required:true},
    carmodel:{type:String,required:true},
    kilometers:{type:Number,required:true},
    horsepower:{type:Number,required:true},
    weight:{type:Number,required:true},
    doors:{type:Number,required:true},
    active:{type:Boolean,required:true},
    description:{type:String,required:true},
    href:{type:String,required:true},
    rentedLength:{type:Number,required:true},
    tags:[{type:String}],
    rented:[Rented]
});

const rentalModel = mongoose.model('rental',rentalSchema);

module.exports = rentalModel;

