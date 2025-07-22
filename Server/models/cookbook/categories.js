let mongoose = require('mongoose');

let categoriesSchema = new mongoose.Schema({
    name:{type:String,required:true}
});

const categoriesModel = mongoose.model('Categories',categoriesSchema);

module.exports = categoriesModel;

