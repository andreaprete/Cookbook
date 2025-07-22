let mongoose = require('mongoose');

let rateSchema = new mongoose.Schema({
    rate:{type:Number,required:true},
    articleId:{type:mongoose.Schema.Types.ObjectId,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,required:true},
});

const rateModel = mongoose.model('rate',rateSchema);

module.exports = rateModel;

