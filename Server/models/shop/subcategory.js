let mongoose = require('mongoose');

let subcategorySchema = new mongoose.Schema({
    name:{type:String,required:true},
});

const subcategoryModel = mongoose.model('subcategory',subcategorySchema);

module.exports = subcategoryModel;

