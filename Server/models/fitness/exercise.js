let mongoose = require('mongoose');


let exerciseSchema = new mongoose.Schema({
    name:{type:String,required:true},
    baseTime:{type:Number,required:true},
    energyBurned:{type:Number,required:true}
});

const exerciseModel = mongoose.model('exercise',exerciseSchema);

module.exports = exerciseModel;

