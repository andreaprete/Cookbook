let mongoose = require('mongoose');


let articleSchema = new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    categoryId:{type:mongoose.Schema.Types.ObjectId,required:true},
    href:{type:String,required:true},
    quantity:{type:Number,required:true},
    rating:{type:Number,required:true},
    shortdescription:{type:String,required:true},
    description:{type:String,required:true},
    subcategoryId:{type:mongoose.Schema.Types.ObjectId,required:false}
});

const articleModel = mongoose.model('article',articleSchema);

module.exports = articleModel;

