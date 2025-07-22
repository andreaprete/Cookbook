const Day = require('../../models/fitness/day');
const Exercise = require('../../models/fitness/exercise');
const Food = require('../../models/fitness/food');
const Profile = require('../../models/fitness/profile');
const verifyToken = require('../session/verifyToken');

module.exports = function(app){
    /**
     * @openapi
     * '/fitness/food/':
     *  post:
     *     tags: 
     *     - Post Methods Fitness
     *     summary: Add food to the database
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
     *              - baseAmount
     *              - energy
     *              - fat
     *              - carbohydrates
     *              - protein
     *              - salt
     *              - fiber
     *              - drink
     *              
     *            properties:
     *              name:
     *                type: String
     *                default: "abc"
     *              baseAmount:
     *                type: Number
     *                default: 123
     *              energy:
     *                type: Number
     *                default: 123
     *              fat:
     *                type: Number
     *                default: 123
     *              carbohydrates:
     *                type: Number
     *                default: 123
     *              protein:
     *                type: Number
     *                default: 123
     *              salt:
     *                type: Number
     *                default: 123
     *              fiber:
     *                type: Number
     *                default: 123
     *              drink:
     *                type: Boolean
     *                default: true
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
    app.post('/fitness/food/', verifyToken,function (req,res){
        try{
            let foodData = req.body;

            let food = new Food(foodData);
            food.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Insert was successful!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

/**
     * @openapi
     * '/fitness/exercise/':
     *  post:
     *     tags: 
     *     - Post Methods Fitness
     *     summary: Add exercises to the database
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
     *              - baseTime
     *              - energyBurned
     *              
     *            properties:
     *              name:
     *                type: String
     *                default: "abc"
     *              baseTime:
     *                type: Number
     *                default: 123
     *              energyBurned:
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
     app.post('/fitness/exercise/', verifyToken,function (req,res){
        try{
            let exerciseData = req.body;

            let exercise = new Exercise(exerciseData);
            exercise.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Insert was successful!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });


/**
     * @openapi
     * '/fitness/profile/':
     *  post:
     *     tags: 
     *     - Post Methods Fitness
     *     summary: Add profiles to the database
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
     *              - age
     *              - height
     *              - weight
     *              - sex
     *              
     *            properties:
     *              name:
     *                type: String
     *                default: "abc"
     *              age:
     *                type: Number
     *                default: 123
     *              height:
     *                type: Number
     *                default: 123
     *              weight:
     *                type: Number
     *                default: 123
     *              sex:
     *                type: Number
     *                default: 123
     * 
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/fitness/profile/', verifyToken,function (req,res){
        try{
            let profileData = req.body;
            profileData.userId = req.user.id;
            let profile = new Profile(profileData);
            profile.save(function (err){
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Insert was successful!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

/**
     * @openapi
     * '/fitness/day/':
     *  post:
     *     tags: 
     *     - Post Methods Fitness
     *     summary: Add food/drinks to a specific day
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
     *              - food
     *              - exercise
     *              - profileId
     *              
     *            properties:
     *              name:
     *                type: String
     *                default: "abc"
     *              food:
     *                type: Array
     *                default: [{foodId:"asdnagh123hj1g32",amount:123}]
     *              exercise:
     *                type: Array
     *                default: [{exerciseId:"sadasdz2321ghasd",timeInMinutes:233}]
     *              profileId:
     *                type: ObjectId
     *                default: ObjectId("sadsd213312ghas")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.post('/fitness/day/', verifyToken,async function (req,res){
        try{
            let dayData = req.body;
            let days = await Day.find({profileId:dayData.profileId,date:dayData.date});
            if(!days.length){
                let day = new Day(dayData);
                day.save(function (err){
                    if(err){
                        res.status(422).send("Data are not correct!");
                    }else{
                        res.status(201).send("Insert was successful!");
                    }
                });
            }
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });




    /**
     * @openapi
     * '/fitness/exercises':
     *  get:
     *     tags: 
     *     - Get Methods Fitness
     *     summary: Get all exercises
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
    app.get('/fitness/exercises', async function (req,res){
        try{
            let exercises = await Exercise.find();
            res.status(200).send(exercises);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });
    /**
     * @openapi
     * '/fitness/food':
     *  get:
     *     tags: 
     *     - Get Methods Fitness
     *     summary: Get all food products
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
    app.get('/fitness/food', async function (req,res){
        try{
            let food = await Food.find();
            res.status(200).send(food);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
    /**
     * @openapi
     * '/fitness/food/food':
     *  get:
     *     tags: 
     *     - Get Methods Fitness
     *     summary: Get all food products which are not drinks
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/fitness/food/food',async function (req,res){
        try{
            let food = await Food.find({drink: false});
            res.status(200).send(food);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
    /**
     * @openapi
     * '/fitness/food/drink':
     *  get:
     *     tags: 
     *     - Get Methods Fitness
     *     summary: Get all food products which are drinks
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/fitness/food/drink',async function (req,res){
        try{
            let drinks = await Food.find({drink: true});
            res.status(200).send(drinks);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

    /**
     * @openapi
     * '/fitness/profiles/':
     *  get:
     *     tags: 
     *     - Get Methods Fitness
     *     summary: Get all profiles which are created by a user
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/fitness/profiles',verifyToken, async function (req,res){
        try{
            let profiles = await Profile.find({userId:req.user.id});
            res.status(200).send(profiles);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

    /**
     * @openapi
     * '/fitness/days/:profileId':
     *  get:
     *     tags: 
     *     - Get Methods Fitness
     *     summary: Get all days which are created by a user
     *     parameters:
     *      - name: profileId
     *        in: path
     *        description: The ID of the profile
     *        required: true
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/fitness/days/:profileId',verifyToken, async function (req,res){
        try{
            let days = await Day.find({profileId:req.params.profileId});
            res.status(200).send(days);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });
    /**
     * @openapi
     * '/fitness/days/:profileId/:date':
     *  get:
     *     tags: 
     *     - Get Methods Fitness
     *     summary: Get a specific day from a profile
     *     parameters:
     *      - name: profileId
     *        in: path
     *        description: The ID of the profile
     *        required: true
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.get('/fitness/day/:profileId/:date',verifyToken, async function (req,res){
        try{
            let day = await Day.find({date:req.params.date,profileId:req.params.profileId});
            res.status(200).send(day);
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });




/**
     * @openapi
     * '/fitness/food/':
     *  put:
     *     tags: 
     *     - Put Methods Fitness
     *     summary: Update food in the database
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
     *              - baseAmount
     *              - energy
     *              - fat
     *              - carbohydrates
     *              - protein
     *              - salt
     *              - fiber
     *              - drink
     *              
     *            properties:
     *              name:
     *                type: String
     *                default: "abc"
     *              baseAmount:
     *                type: Number
     *                default: 123
     *              energy:
     *                type: Number
     *                default: 123
     *              fat:
     *                type: Number
     *                default: 123
     *              carbohydrates:
     *                type: Number
     *                default: 123
     *              protein:
     *                type: Number
     *                default: 123
     *              salt:
     *                type: Number
     *                default: 123
     *              fiber:
     *                type: Number
     *                default: 123
     *              drink:
     *                type: Boolean
     *                default: true
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/fitness/food/', verifyToken,function (req,res){
        try{
            let foodData = req.body;
            let updatedFoodData = {    
                name:foodData.name,
                baseAmount:foodData.baseAmount,
                energy:foodData.energy,
                fat:foodData.fat,
                carbohydrates:foodData.carbohydrates,
                protein:foodData.protein,
                salt:foodData.salt,
                fiber:foodData.fiber,
                drink:foodData.drink
            }
            Food.findByIdAndUpdate({_id:req.body.foodId},updatedFoodData, (err,result)=>{
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Update was successful!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

/**
     * @openapi
     * '/fitness/exercise/':
     *  put:
     *     tags: 
     *     - Put Methods Fitness
     *     summary: Update exercises in the database
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
     *              - baseTime
     *              - energyBurned
     *              
     *            properties:
     *              name:
     *                type: String
     *                default: "abc"
     *              baseTime:
     *                type: Number
     *                default: 123
     *              energyBurned:
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
     app.put('/fitness/exercise/', verifyToken,function (req,res){
        try{
            let exerciseData = req.body;
            let updatedExerciseData = {    
                name:exerciseData.name,
                baseTime:exerciseData.baseTime,
                energyBurned:exerciseData.energyBurned,
            }
            Exercise.findByIdAndUpdate({_id:req.body.exerciseId},updatedExerciseData, (err,result)=>{
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Update was successful!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

     /**
     * @openapi
     * '/fitness/profile/':
     *  put:
     *     tags: 
     *     - Put Methods Fitness
     *     summary: Update profiles in the database
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
     *              - age
     *              - height
     *              - weight
     *              - sex
     *              - profileId
     *              
     *            properties:
     *              name:
     *                type: String
     *                default: "abc"
     *              age:
     *                type: Number
     *                default: 123
     *              height:
     *                type: Number
     *                default: 123
     *              weight:
     *                type: Number
     *                default: 123
     *              sex:
     *                type: Number
     *                default: 123
     *              profileId:
     *                type: ObjectId
     *                default: ObjectId("hagsdh32112hdsdsaf")
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/fitness/profile/', verifyToken,function (req,res){
        try{
            let profileData = req.body;
            let updatedProfileData = {    
                name:profileData.name,
                age:profileData.age,
                height:profileData.height,
                weight:profileData.weight,
                sex:profileData.sex,
                userId:req.user.id
            }
            Profile.findByIdAndUpdate({_id:req.body.profileId},updatedProfileData, (err,result)=>{
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Update was successful!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });

/**
     * @openapi
     * '/fitness/day/':
     *  post:
     *     tags: 
     *     - Post Methods Fitness
     *     summary: Add food/drinks to a specific day
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - dayId
     *              - food
     *              - exercise
     *              
     *            properties:
     *              dayId:
     *                type: String
     *                default: "abc"
     *              food:
     *                type: Array
     *                default: [{foodId:"asdnagh123hj1g32",amount:123}]
     *              exercise:
     *                type: Array
     *                default: [{exerciseId:"sadasdz2321ghasd",timeInMinutes:233}]
     *     responses:
     *      201:
     *        description: successfully added
     *      422:
     *        description: Data are not correct
     *      500:
     *        description: Server Error
     */
     app.put('/fitness/day/', verifyToken,function (req,res){
        try{
            let dayData = req.body;
            let updatedDayData = {    
                food:dayData.food,
                exercise:dayData.exercise,
            }
            Day.findByIdAndUpdate({_id:req.body.dayId},updatedDayData, (err,result)=>{
                if(err){
                    res.status(422).send("Data are not correct!");
                }else{
                    res.status(201).send("Update was successful!");
                }
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
     });








/**
     * @openapi
     * '/fitness/exercise/:exerciseId':
     *  delete:
     *     tags: 
     *     - Delete Methods Fitness
     *     summary: delete a specific exercise
     *     parameters:
     *      - name: exerciseId
     *        in: path
     *        description: The ID of the exercise
     *        required: true
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
     app.delete('/fitness/exercise/:exerciseId', verifyToken,async function (req,res){
        try{
            await Exercise.deleteOne({_id:req.params.exerciseId}).then(()=>{
                res.status(201).send("Delete was successful!");
            }).catch(err =>{
                res.status(500).send({err:err});
            })
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });

/**
     * @openapi
     * '/fitness/exercise/:foodId':
     *  delete:
     *     tags: 
     *     - Delete Methods Fitness
     *     summary: delete a specific food item
     *     parameters:
     *      - name: foodId
     *        in: path
     *        description: The ID of the food item
     *        required: true
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
    app.delete('/fitness/food/:foodId', verifyToken,async function (req,res){
        try{
            await Food.deleteOne({_id:req.params.foodId}).then(()=>{
                res.status(201).send("Delete was successful!");
            }).catch(err =>{
                res.status(500).send({err:err});
            })
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });

/**
     * @openapi
     * '/fitness/day/:dayId':
     *  delete:
     *     tags: 
     *     - Delete Methods Fitness
     *     summary: delete a specific day
     *     parameters:
     *      - name: dayId
     *        in: path
     *        description: The ID of the day
     *        required: true
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
    app.delete('/fitness/day/:dayId', verifyToken,async function (req,res){
        try{
            await Day.deleteOne({_id:req.params.dayId}).then(()=>{
                res.status(201).send("Delete was successful!");
            }).catch(err =>{
                res.status(500).send({err:err});
            })
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });

    /**
     * @openapi
     * '/fitness/profile/:profileId':
     *  delete:
     *     tags: 
     *     - Delete Methods Fitness
     *     summary: delete a specific profile
     *     parameters:
     *      - name: profileId
     *        in: path
     *        description: The ID of the profile
     *        required: true
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: Fetched Successfully
     *      500:
     *        description: Server Error
     */
    app.delete('/fitness/profile/:profileId', verifyToken,async function (req,res){
        try{
            await Day.deleteMany({profileId:req.params.profileId}).then(async ()=>{
                await Profile.deleteOne({_id:req.params.profileId}).then(()=>{
                    res.status(201).send("Delete was successful!");
                }).catch(err =>{
                    res.send({err:err});
                });
            }).catch(err=>{
                res.send({err:err,msg:"Deleting all days for this profile went wrong!"});
            });
        }catch(error){
            let errorObj = {body:req.body,errorMessage:"Server error!" };
            res.status(500).send(errorObj);   
        }
    });




}