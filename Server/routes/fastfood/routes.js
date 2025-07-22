const Article = require('../../models/fastfood/article');
const Category = require('../../models/fastfood/category');
const Order = require('../../models/fastfood/order');
const Comment = require('../../models/fastfood/comment');
const verifyToken = require('../session/verifyToken');

module.exports = function(app){
    /** GET Methods*/
    /**
     * @openapi
     *  '/fastfood/articles':
     *      get:
     *          tags: 
     *              - Get Methods Fastfood
     *          summary: Get all articles
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
    app.get('/fastfood/articles', async function (req,res){
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
     *  '/fastfood/articles/:categoryId':
     *      get:
     *          tags:
     *              - Get Methods Fastfood
     *          summary: Get all food products from a specific category
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
    app.get('/fastfood/articles/:categoryId', async function (req,res){
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
     *  '/fastfood/article/:articleId':
     *      get:
     *          tags:
     *              - Get Methods Fastfood
     *          summary: Get a specific food product
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
     app.get('/fastfood/article/:articleId', async function (req,res){
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
     *  '/fastfood/categories':
     *      get:
     *          tags: 
     *              - Get Methods Fastfood
     *          summary: Get all categories
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/fastfood/categories/', async function (req,res){
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
     *  '/fastfood/comments/:articleId':
     *      get:
     *          tags:
     *              - Get Methods Fastfood
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
     app.get('/fastfood/comments/:articleId',async function (req,res){
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
     *  '/fastfood/orders':
     *      get:
     *          tags: 
     *              - Get Methods Fastfood
     *          summary: Get all orders from a user
     *          security:
     *              - bearerAuth: []
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
     app.get('/fastfood/orders/',verifyToken, async function (req,res){
        try{
            let orders = await Order.find({userId:req.user.id});
            res.status(200).send(orders);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });






     /**
     * @openapi
     * '/fastfood/order/':
     *  post:
     *     tags: 
     *     - Post Methods Fastfood
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
     app.post('/fastfood/order/', verifyToken,function (req,res){
        try{
            let orderData = req.body;

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
     * '/fastfood/comment/':
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
     app.post('/fastfood/comment/', verifyToken,async function (req,res){
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
     * '/fastfood/rate/':
     *  post:
     *     tags: 
     *     - Post Methods Fastfood
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
     app.post('/fastfood/rate/', verifyToken,async function (req,res){
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
     * '/fastfood/category/':
     *  post:
     *     tags: 
     *     - Post Methods Fastfood
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
     app.post('/fastfood/category', verifyToken,function(req,res){
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
     * '/fastfood/article/':
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
     *              - name
     *              - price
     *              - categoryId
     *              - vegetarian
     *              - href
     *              - quantity
     *              - rating
     *              - shortdescription
     *              - description
     *              - ingredients
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
     *              vegetarian:
     *                  type: Boolean
     *                  default: true
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
     *              ingredients:
     *                  type: [String]
     *                  default: ["abc"]
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/fastfood/article', verifyToken,function(req,res){
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