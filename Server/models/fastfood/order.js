let mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    orderNr:{type:Number,required:true},
    articles:[{
        articleId:{type:mongoose.Schema.Types.ObjectId,required:true},
        quantity:{type:Number,required:true},
        price:{type:Number,required:true}
    }],
    userId:{type:mongoose.Schema.Types.ObjectId,required:true},
    orderDate:{type:String,required:true}
});



orderSchema.pre('save', function(next){
    let ono=1;
    let order = this;
    orderModel.find({},function(err,orders){
        if(err) throw err;
        ono = orders.length+1;
        order.orderNr =ono;
        next();
    })

 }
);

const orderModel = mongoose.model('order',orderSchema);

module.exports = orderModel;

