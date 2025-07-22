const Article = require('../../models/shop/article');
const Category = require('../../models/shop/category');
const Order = require('../../models/shop/order');
const Comment = require('../../models/shop/comment');
const Subcategory = require('../../models/shop/subcategory');
const Rate = require('../../models/shop/rate');

const verifyToken = require('../session/verifyToken');


module.exports = function(app){
    /** GET Methods*/
    /**
     * @openapi
     *  '/shop/articles':
     *      get:
     *          tags: 
     *              - Get Methods Shop
     *          summary: Get all articles
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
    app.get('/shop/articles', async function (req,res){
        try{
            let articles = await Article.find();
            res.status(200).send(articles);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });
    /**
     * @openapi
     *  '/shop/articles/:categoryId':
     *      get:
     *          tags:
     *              - Get Methods Shop
     *          summary: Get all products from a specific category
     *          parameters:
     *              - name: categoryId
     *                in: path
     *                description: The ID of the category
     *                required: true
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
    app.get('/shop/articles/:categoryId', async function (req,res){
        try{
            let articles = await Article.find({categoryId:req.params.categoryId});
            res.status(200).send(articles);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

    /**
     * @openapi
     *  '/shop/article/:articleId':
     *      get:
     *          tags:
     *              - Get Methods Shop
     *          summary: Get a specific product
     *          parameters:
     *              - name: articleId
     *                in: path
     *                description: The ID of the product
     *                required: true
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/shop/article/:articleId', async function (req,res){
        try{
            let article = await Article.findById(req.params.articleId);
            res.status(200).send(article);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

    /**
     * @openapi
     *  '/shop/categories':
     *      get:
     *          tags: 
     *              - Get Methods Shop
     *          summary: Get all categories
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/shop/categories/', async function (req,res){
        try{     
            let categories = await Category.find();
            res.status(200).send(categories);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

    /**
     * @openapi
     *  '/shop/comments/:articleId':
     *      get:
     *          tags:
     *              - Get Methods Shop
     *          summary: Get all comments to a specific product
     *          parameters:
     *              - name: articleId
     *                in: path
     *                description: The ID of the product
     *                required: true
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/shop/comments/:articleId',async function (req,res){
        try{
            let comments = await Comment.find({articleId: req.params.articleId});
            res.status(200).send(comments);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
    /**
     * @openapi
     *  '/shop/subcategories':
     *      get:
     *          tags: 
     *              - Get Methods Shop
     *          summary: Get all subcategories
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
    app.get('/shop/subcategories/', async function (req,res){
        try{
            let subcategories = await Subcategory.find();
            res.status(200).send(subcategories);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    
    });


    /**
     * @openapi
     *  '/shop/orders':
     *      get:
     *          tags: 
     *              - Get Methods Shop
     *          summary: Get all orders from a user
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/shop/orders/', verifyToken,async function (req,res){
        try{
            let orders = await Order.find({userId: req.user.id}).sort({orderNr:'desc'});
            res.status(200).send(orders);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


     /**
     * @openapi
     * '/shop/order/':
     *  post:
     *     tags: 
     *     - Post Methods Shop
     *     summary: Add a order
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - articles
     *              - userId
     *              - orderDate
     *            properties:
     *              articles:
     *                  type: [Objects]
     *                  default:  [{articleId,quantity,price}]
     *              userId: 
     *                  type: ObjectId
     *                  default: ObjectId("asdasd7668asdasd")
     *              orderDate:
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
     app.post('/shop/order/', verifyToken,function (req,res){
        try{

            let date = new Date();
            let orderData = {
                userId: req.user.id,
                articles:req.body,
                orderDate:date.getDate() + "." + (date.getMonth()+1) + "."+date.getFullYear()
            }
            let order = new Order(orderData);
            order.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Order was successful!");
                }
            });


        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


     /**
     * @openapi
     * '/shop/comment/':
     *  post:
     *     tags: 
     *     - Post Methods Fastfood
     *     summary: Add a comment to a product
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - articleId
     *              - comment
     *              - userId
     *              - date
     *            properties:
     *              articleId:
     *                  type: [Objects]
     *                  default:  [{articleId,quantity,price}]
     *              comment: 
     *                  type: String
     *                  default: "abc"
     *              userId:
     *                  type: ObjectsId
     *                  default: ObjectId("ada787asd87as")
     *              date:
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
     app.post('/shop/comment/', verifyToken,async function (req,res){
        try{
            let orders = await Order.find({userId: req.user.id}).sort({orderNr:'desc'});
            let boughtArticle = false;

            loop:
            for(let i=0; i < orders.length; i++){
                for(let j =0; j < orders[i].articles.length;j++){
                    if(req.body.articleId == orders[i].articles[j].articleId){
                        boughtArticle = true;
                        break loop;
                    }
                }
            }


            if(boughtArticle){
                let commentData = req.body;
                let comment = new Comment(commentData);
                comment.save(function (err){
                    if(err){
                        res.status(422).send("Data are not correct!");
                    }else{
                        res.status(201).send("Comment was successful!");
                    }
                });
            }else{
                res.status(422).send("Article was not bought!");
            }
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }

     });

 /**
     * @openapi
     * '/shop/rate/':
     *  post:
     *     tags: 
     *     - Post Methods Shop
     *     summary: Add a rating to a product
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - articleId
     *              - rate
     *              - userId
     *            properties:
     *              articleId:
     *                  type: [Objects]
     *                  default:  [{articleId,quantity,price}]
     *              rate: 
     *                  type: String
     *                  default: "abc"
     *              userId:
     *                  type: ObjectsId
     *                  default: ObjectId("ada787asd87as")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/shop/rate/', verifyToken,async function (req,res){
        try{
            let orders = await Order.find({userId: req.user.id}).sort({orderNr:'desc'});

            let boughtArticle = false;
            loop:
            for(let i=0; i < orders.length; i++){
                for(let j =0; j < orders[i].articles.length;j++){
                    if(req.body.articleId == orders[i].articles[j].articleId){
                        boughtArticle = true;
                        break loop;
                    }
                }
            }


            if(boughtArticle){

                let ratings = await Rate.find({articleId: req.body.articleId});

                let newRating =0;
                let rated =false;
                for(let i=0; i < ratings.length;i++){

                    if(ratings[i].userId == req.user.id){
                        rated = true;
                        break;
                    }
                    newRating =  newRating + rating[i];
                }


                if(!rated){

                    newRating = newRating + req.body.rate;
                    newRating = newRating / (ratings.length+1);

                    await Article.findByIdAndUpdate({_id:req.body.articleId},{"rating":newRating});

                    let rateData = req.body;
                    let rate = new Rate(rateData);
                    rate.save(function (err){
                        if(err){
                            res.status(422).send("Data are not correct!");
                        }else{
                            res.status(201).send("Rating was successful!");
                        }
                    });
                }else{
                    res.status(422).send("Article was already rated!");
                }
            }else{
                res.status(422).send("Article was not bought, can not be rated!");
            }

        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

/**
     * @openapi
     * '/shop/category/':
     *  post:
     *     tags: 
     *     - Post Methods Shop
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
     *            properties:
     *              name: 
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
     app.post('/shop/category', verifyToken,function(req,res){
        try{
            let categoryData = req.body;

            let category = new Category(categoryData);
            category.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Category was successfully added!");
                }
            });

        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
/**
     * @openapi
     * '/shop/subcategory/':
     *  post:
     *     tags: 
     *     - Post Methods Shop
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
     *            properties:
     *              name: 
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
     app.post('/shop/subcategory', verifyToken,function(req,res){
        try{
            let categoryData = req.body;

            let category = new Subcategory(categoryData);
            category.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Category was successfully added!");
                }
            });

        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

/**
     * @openapi
     * '/shop/article/':
     *  post:
     *     tags: 
     *     - Post Methods Shop
     *     summary: Add a comment to a product
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
     *              - price
     *              - categoryId
     *              - href
     *              - quantity
     *              - rating
     *              - shortdescription
     *              - description
     *              - subcategoryId
     *            properties:
     *              name:
     *                  type: String
     *                  default: "abc"
     *              price:
     *                  type: Number
     *                  default: 123
     *              categoryId:
     *                  type: ObjectId
     *                  default: ObjectId("asdasd32234asda")
     *              href:
     *                  type: String
     *                  default: "https://www.muster.de"
     *              quantity:
     *                  type: Number
     *                  default: 123
     *              rating:
     *                  type: Number
     *                  default: 123
     *              shortdescription:
     *                  type: String
     *                  default: "abc"
     *              description:
     *                  type: String
     *                  deafult: "abc"     
     *              subcategoryId:
     *                  type: ObjectId
     *                  default:  ObjectId("asdasd32234asda")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/shop/article', verifyToken,function(req,res){
        try{
            let articleData = req.body;

            let article = new Article(articleData);
            article.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Article was successfully added!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
}