let mongoose = require('mongoose');


let categorySchema = new mongoose.Schema({
    cartype:{type:String,required:true},
});  

const categoryModel = mongoose.model('category',categorySchema);

module.exports = categoryModel;

