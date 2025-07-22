let mongoose = require('mongoose');


let foodSchema = new mongoose.Schema({
    name:{type:String,required:true},
    baseAmount:{type:Number,required:true},
    energy:{type:Number,required:true},
    fat:{type:Number,required:true},
    carbohydrates:{type:Number,required:true},
    protein:{type:Number,required:true},
    salt:{type:Number,required:true},
    fiber:{type:Number,required:true},
    drink:{type:Boolean,required:true}
});

const foodModel = mongoose.model('food',foodSchema);

module.exports = foodModel;

