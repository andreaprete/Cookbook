let mongoose = require('mongoose');


let categorySchema = new mongoose.Schema({
    name:{type:String,required:true},
});

const categoryModel = mongoose.model('category',categorySchema);

module.exports = categoryModel;

