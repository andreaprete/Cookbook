var mongoose = require("mongoose");

const Categories = require('../../models/cookbook/categories');
const Recipe = require('../../models/cookbook/recipe');
const User = require('../../models/user');


const verifyToken = require('../session/verifyToken');


module.exports = function(app){
    /** GET Methods*/
    /**
     * @openapi
     *  '/cookbook/recipes':
     *      get:
     *          tags: 
     *              - Get Methods Cookbook
     *          summary: Get all recipes
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
    app.get('/cookbook/recipes', async function (req,res){
        try{
            let recipes = await Recipe.find();
            res.status(200).send(recipes);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });

    /**
     * @openapi
     *  '/cookbook/recipe/:recipeId':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: Get a specific recipes
     *          parameters:
     *              - name: recipeId
     *                in: path
     *                description: The ID of the recipe
     *                required: true
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/recipe/:recipeId', async function (req, res) {
        try {
            const recipe = await Recipe.findById(req.params.recipeId)
            .populate('user', 'firstname lastname')
            .populate('comments.user', 'firstname lastname');

            res.status(200).send(recipe);
        } catch (error) {
            console.error('❌ Recipe fetch error:', error);
            res.status(500).send({ error: 'Internal server error', detail: error.message });
        }
        });

    /**
     * @openapi
     *  '/cookbook/user/recipe':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: Get recipes from the current user
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/user/recipe/',verifyToken, async function (req,res){
        try{
            let recipes = await Recipe.find({user:req.user.id});
            res.status(200).send(recipes);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     /**
     * @openapi
     *  '/cookbook/categories':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: Get all categories
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/categories/', async function (req,res){
        try{     
            let categories = await Categories.find();
            res.status(200).send(categories);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     /**
     * @openapi
     *  '/cookbook/search':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: search for a recipe
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/search',verifyToken, async function (req,res){
        try{     
            const filters = req.query.tags;
            const category = req.query.category;


            let recipes = null;
            let searchTags = null; 
            let searchCategories = null;
            if(filters){
                searchTags = filters.toLowerCase().split(',')
            }

            if(category){
                searchCategories = category.toLowerCase().split(',')
            }


            if(filters && !category){
                recipes = await Recipe.find({tags:{$in:searchTags}})
            }else if(!filters  && category){
                recipes = await Recipe.find({categories:{$in:searchCategories}});
            }else if (filters && category){
                recipes = await Recipe.find({categories:{$in:searchCategories}, tags:{$in:searchTags}});
            }
            res.status(200).send(recipes);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


     /**
     * @openapi
     *  '/cookbook/saved/':
     *      get:
     *          tags:
     *              - Get Methods Cookbook
     *          summary: Get all recipes the user saved/liked
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/cookbook/saved/', verifyToken, async function (req,res){
        try{     
            let recipes = await User.findOne({_id:req.user.id}).populate('savedRecipes');
            res.status(200).send(recipes);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });



     /**
     * @openapi
     * '/cookbook/recipe/':
     *  post:
     *     tags: 
     *     - Post Methods Cookbook
     *     summary: Add a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - name
     *              - ingredients
     *              - portion
     *              - nutritionalValues
     *              - directions
     *              - tags
     *              - href
     *              - time
     *              - comments
     *              - rating
     *              - categories
     *              - user
     *            properties:
     *              name:
     *                  type: String
     *                  default: "abc"
     *              ingredients: 
     *                  type: [Object]
     *                  default: [{ingredient,amount,unit}]
     *              portion:
     *                  type: Number
     *                  default: 123
     *              nutritionalValues: 
     *                  type: [Object]
     *                  default: [{kcal,protein,fat,carbohydrates}]
     *              directions:
     *                  type: String
     *                  default: "abc"
     *              tags:
     *                  type: [String]
     *                  default: ["abc"]
     *              href:
     *                  type: String
     *                  default: "abc"
     *              time:
     *                  type: Number
     *                  default: 123
     *              comments: 
     *                  type: [Object]
     *                  default: [{user,comment}]
     *              rating:
     *                  type: [Number]
     *                  default: [ 1, 2, 4]
     *              categories:
     *                  type: [ObjectId]
     *                  default: [ObjectId("54fghgf645"), ObjectId("hga76ghasd")]
     *              user:
     *                  type: ObjectId
     *                  default: ObjectId("hgasdhasgtutzutt45tdgd")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/cookbook/recipe/', verifyToken,function (req,res){
        try{

            let recipeData = req.body
            recipeData.user = req.user.id;
            recipeData.tags = recipeData.tags.map(v => v.toLowerCase());
            let recipe = new Recipe(recipeData);
            recipe.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("successfully added!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

/**
     * @openapi
     * '/cookbook/category/':
     *  post:
     *     tags: 
     *     - Post Methods Cookbook
     *     summary: Add a category
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - name
     *              
     *            properties:
     *              name:
     *                type: String
     *                default: "abc"
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/cookbook/category/', function (req,res){
        try{

            let categoryName = req.body
            let category = new Categories(categoryName);
            category.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("successfully added!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


/**
     * @openapi
     * '/cookbook/save/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Save/Like a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *            properties:
     *              recipe:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/save/recipe', verifyToken,async function (req,res){
        try{
            let recipeId = req.body.recipe
            let user = await User.findOne({_id:req.user.id});
            user.savedRecipes.push(recipeId);
            user.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("successfully updated!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
     
     /**
     * @openapi
     * '/cookbook/save/delete/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Unlike a recipe and delete the like
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *            properties:
     *              recipe:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/save/delete/recipe', verifyToken,async function (req,res){
        try{
            let recipeId = req.body.recipe
            await User.updateOne({_id:req.user.id},{$pull:{savedRecipes:recipeId}});
            res.status(201).send("successfully updated!");
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     /**
     * @openapi
     * '/cookbook/rate/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Save/Like a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *              - rating
     *            properties:
     *              recipe:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              rateing:
     *                  type: Number
     *                  defult: 1
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/rate/recipe', verifyToken, async function (req, res) {
      try {
        const { rating, recipe: recipeId } = req.body;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(422).send("Invalid user ID");
        }

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
          return res.status(422).send("Invalid recipe ID");
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
          return res.status(404).send("Recipe not found");
        }

        // Ensure rating is a number and valid
        const parsedRating = parseInt(rating);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
          return res.status(400).send("Rating must be a number between 1 and 5");
        }

        // Find if user already rated
        const existing = recipe.rating.find(r => r.user.toString() === userId);

        if (existing) {
          existing.value = parsedRating;
        } else {
          recipe.rating.push({ user: userId, value: parsedRating });
        }

        await recipe.save(); // async/await version is more reliable than callback

        res.status(201).send("Successfully updated!");
      } catch (err) {
        console.error("❌ Rating error:", err);
        res.status(500).send("Server error");
      }
    });

     /**
     * @openapi
     * '/cookbook/comment/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Save/Like a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *              - comment
     *            properties:
     *              recipe:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              comment:
     *                  type: String
     *                  default: "abc"
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/comment/recipe', verifyToken, async function (req, res) {
      try {
        const { comment, recipe: recipeId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
          return res.status(422).send("Invalid user ID");
        }

        if (!comment || typeof comment !== 'string') {
          return res.status(422).send("Comment is required and must be a string");
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
          return res.status(404).send("Recipe not found");
        }

        const newComment = { user: req.user.id, comment };
        recipe.comments.push(newComment);

        recipe.save(err => {
          if (err) {
            console.error("❌ Save error:", err);
            return res.status(422).send("Data are not correct!");
          }
          res.status(201).send("Successfully updated!");
        });
      } catch (error) {
        console.error("❌ Server error:", error);
        res.status(500).send({ error: "Server error", detail: error.message });
      }
    });

     /**
     * @openapi
     * '/cookbook/commentrate/recipe':
     *  put:
     *     tags: 
     *     - Put Methods Cookbook
     *     summary: Save/Like a recipe
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - recipe
     *              - rating
     *              - recipe
     *            properties:
     *              recipe:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              comment:
     *                type: String
     *                default: "abc"
     *              rating:
     *                type: Number
     *                default: 1  
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/cookbook/commentrate/recipe', verifyToken, async function (req, res) {
      try {
        const { comment, rating, recipe: recipeId } = req.body;
        const userId = req.user.id;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
          return res.status(404).send("Recipe not found");
        }

        // Add comment
        const c = { user: userId, comment };
        recipe.comments.push(c);

        // Ensure only one rating per user
        recipe.rating = recipe.rating.filter(r => r.user.toString() !== userId);
        recipe.rating.push({ user: userId, value: rating });

        // Save updated recipe
        recipe.save(function (err) {
          if (err) {
            console.error('❌ Save error:', err);
            return res.status(422).send("Data are not correct!");
          }
          res.status(201).send("Successfully updated!");
        });

      } catch (error) {
        console.error('❌ Server error:', error);
        const errorObj = { body: req.body, errorMessage: "Server error!" };
        res.status(500).send(errorObj);
      }
    });

    /**
     * @openapi
     * '/cookbook/delete/:recipe':
     *  delete:
     *     tags: 
     *          - Delete Methods Cookbook
     *     summary: delete a recipe
     *     security:
     *          - bearerAuth: []
     *     parameters:
     *          - name: recipe
     *            in: path
     *            description: The ID of the recipe
     *            required: true
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.delete('/cookbook/delete/:recipe', verifyToken,async function (req,res){
        try{
            let recipeId = req.params.recipe
            let userId = req.user.id
            const returnValue = await Recipe.deleteOne({_id:recipeId,user:userId})
            if(returnValue.deletedCount == 1){
                res.status(201).send("successfully deleted!");
            }else{
                res.status(422).send("something did go wrong while deleting");
            }
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

} 