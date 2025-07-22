const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [
    {
      ingredient: { type: String, required: true },
      amount: { type: Number, required: true },
      unit: { type: String, required: true }
    }
  ],
  portion: { type: Number, required: true },
  nutritionalValues: [
    {
      kcal: { type: String, required: true },
      protein: { type: String, required: true },
      fat: { type: String, required: true },
      carbohydrates: { type: String, required: true }
    }
  ],
  directions: { type: String, required: true },
  tags: [String],
  href: { type: String, required: true },
  time: { type: Number, required: true },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      comment: { type: String, required: true }
    }
  ],
  rating: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: true }
  }],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
      required: true
    }
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const recipeModel = mongoose.model('Recipe', recipeSchema);
module.exports = recipeModel;
