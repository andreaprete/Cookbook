const Rental = require('../../models/carrental/rental');
const Category = require('../../models/carrental/category');
const Rented = require('../../models/carrental/rented');


const verifyToken = require('../session/verifyToken');


module.exports = function(app){
    /** GET Methods*/
    /**
     * @openapi
     *  '/carrental/cars':
     *      get:
     *          tags: 
     *              - Get Methods Car Rental
     *          summary: Get all cars
     *          responses:
     *              200:
     *                  description: Fetched Successfully
     *              500:
     *                  description: Server Error
     */
    app.get('/carrental/cars', async function (req,res){
        try{
            let cars = await Rental.find({active:true},{"rented":0});
            res.status(200).send(cars);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });


    /**
     * @openapi
     * '/carrental/car/:rentalId':
     *  get:
     *     tags: 
     *     - Get Methods Car Rental
     *     summary: Get a specific car
     *     parameters:
     *      - name: rentalId
     *        in: path
     *        description: The ID of the car
     *        required: true
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/carrental/car/:rentalId', async function (req,res){
        try{
            let rental = await Rental.findById(req.params.rentalId,{"rented":0});
            res.status(200).send(rental);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


    /**
     * @openapi
     * '/carrental/cartypes/':
     *  get:
     *     tags: 
     *     - Get Methods Car Rental
     *     summary: Get all car types
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/carrental/cartypes/', async function (req,res){
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
     * '/carrental/search/':
     *  get:
     *     tags: 
     *     - Get Methods Car Rental
     *     summary: Search for cars
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *      - name: tags
     *        in: query
     *        description: Search tags
     *        required: false
     *      - name: date
     *        in: query
     *        description: Search for a specific day
     *        required: false
     *      - name: category
     *        in: query
     *        description: Search categories
     *        required: false
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/carrental/search',verifyToken, async function (req,res){
        try{     
            const filters = req.query.tags;
            const date = req.query.date;
            const category = req.query.category;


            let rentals = null;
            let searchTags = null; 
            let dateInt =null;
            if(filters){
                searchTags = filters.toLowerCase().split(',')
            }

            if(date){
                dateInt = parseInt(date);
            }

            if(filters && !date && !category){
                rentals = await Rental.find({tags:{$in:searchTags},'active':true},{"rented":0})
            }else if (!filters && date && !category){
                rentals = await Rental.find({$or:[
                                                {'rented.date':{$not:{$eq:dateInt}},'active':true},
                                                {"rentedLength":{$lte:0},'active':true}
                                            ]},{"rented":0});
            }else if(!filters && !date && category){
                rentals = await Rental.find({cartype:category, active:true});
            }else if (filters && date && !category){
                rentals = await Rental.find({$and:[
                                                {$or:[
                                                    {'rented.date':{$not:{$eq:dateInt}},'active':true},
                                                    {"rentedLength":{$lte:0},'active':true}
                                                ]},
                                                {'tags':{$in:searchTags}}
                                                ]
                                            },{"rented":0});
            }else if (filters && !date && category){
                rentals = await Rental.find({cartype:category, active:true,tags:{$in:searchTags}});
            }else if (!filters && date && category){
                rentals = await Rental.find({$and:[
                                                {$or:[
                                                    {'rented.date':{$not:{$eq:dateInt}},'active':true},
                                                    {"rentedLength":{$lte:0},'active':true}
                                                ]},
                                                {cartype:category}
                                                ]
                                            },{"rented":0});
            }else if (filters && date && category){
                rentals = await Rental.find({$and:[
                                                {$or:[
                                                    {'rented.date':{$not:{$eq:dateInt}},'active':true},
                                                    {"rentedLength":{$lte:0},'active':true}
                                                ]},
                                                {cartype:category},
                                                {'tags':{$in:searchTags}}
                                                ]
                                            },{"rented":0});
            }
            res.status(200).send(rentals);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

    /**
     * @openapi
     * '/carrental/rented/':
     *  get:
     *     tags: 
     *     - Get Methods Car Rental
     *     summary: Get all rented cars
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/carrental/rented/',verifyToken, async function (req,res){
        try{
            let rented = await Rental.find({"rented.userId":req.user.id},{_id:1,'rented.$':1});
            res.status(200).send(rented);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

    /**
     * @openapi
     * '/carrental/lent/':
     *  get:
     *     tags: 
     *     - Get Methods Car Rental
     *     summary: All cars which where lent
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/carrental/lent/',verifyToken, async function (req,res){
        try{     
            let lent = await Rental.find({owner:req.user.id, rentedLength:{$gt:0}});
            res.status(200).send(lent);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


    /**
     * @openapi
     * '/carrental/rental/':
     *  post:
     *     tags: 
     *     - Post Methods Car Rental
     *     summary: Add a new car as a rental
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - cartype
     *              - owner
     *              - price
     *              - brand
     *              - carmodel
     *              - kilometers
     *              - horsepower
     *              - weight
     *              - doors
     *              - active
     *              - description
     *              - href
     *              - rentedLength
     *              - tags
     *            properties:
     *              cartype:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              owner:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              price:
     *                type: Number
     *                default: 123
     *              brand:
     *                type: String
     *                default: "abc"
     *              carmodel: 
     *                type: String
     *                default: "abc"
     *              kilometers:
     *                type: Number
     *                default: 123
     *              horsepower:
     *                type: Number
     *                default: 123
     *              weight:
     *                type: Number
     *                default: 123
     *              doors:
     *                type: Number
     *                default: 123
     *              active:
     *                type: Boolean
     *                default: true
     *              description:
     *                type: String
     *                default: "abc"
     *              href:
     *                type: String
     *                default: "abc"
     *              rentedLength:
     *                type: Number
     *                default: 123
     *              tags:
     *                type: [String]
     *                default: ["abc","abc"]
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/carrental/rental/', verifyToken,function (req,res){
        try{

            let rentalData = req.body
            rentalData.rentedLength = 0;
            let rental = new Rental(rentalData);
            rental.save(function (err){
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
     * '/carrental/rent/':
     *  post:
     *     tags: 
     *     - Post Methods Car Rental
     *     summary: Rent a car
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - userId
     *              - name
     *              - date
     *              - price
     *              
     *            properties:
     *              userId:
     *                type: ObjectId
     *                default: ObjectId("adasdadhjkh89234")
     *              name:
     *                type: String
     *                default: "abc"
     *              date:
     *                type: Number
     *                default: 123
     *              price:
     *                type: Number
     *                default: 123
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/carrental/rent/', verifyToken, async function (req,res){
        try{
            let rentData = req.body;
            let rentalId = rentData.rentalId;
            delete rentData.rentalId;
            let rental = await Rental.findById(rentalId);
            rental.rented.push(rentData)
            rental.rentedLength = rental.rentedLength+1;
            rental.save(function (err){
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



} 