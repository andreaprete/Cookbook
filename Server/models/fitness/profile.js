let mongoose = require('mongoose');


let profileSchema = new mongoose.Schema({
    name:{type:String,required:true},
    age:{type:Number,required:true},
    height:{type:Number,required:true},
    weight:{type:Number,required:true},
    sex:{type:Number,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,required:true}
});

const profileModel = mongoose.model('profile',profileSchema);

module.exports = profileModel;

