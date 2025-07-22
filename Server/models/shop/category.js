let mongoose = require('mongoose');


let categorySchema = new mongoose.Schema({
    name:{type:String,required:true},
    subcategoryIds:[{type:mongoose.Schema.Types.ObjectId,required:false}],

});

const categoryModel = mongoose.model('category',categorySchema);

module.exports = categoryModel;

