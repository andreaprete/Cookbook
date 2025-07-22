let mongoose = require('mongoose');


let daySchema = new mongoose.Schema({
    date:{type:String,required:true},
    food:[{
        foodId:{type:mongoose.Schema.Types.ObjectId,required:true},
        amount:{type:Number,required:true},
    }],
    exercise:[{
        exerciseId:{type:mongoose.Schema.Types.ObjectId,required:true},
        timeInMinutes:{type:Number,required:true},
    }],
    profileId:{type:mongoose.Schema.Types.ObjectId,required:true}
});

const dayModel = mongoose.model('day',daySchema);

module.exports = dayModel;

