const User = require('../../models/user');
const SHA256 = require("crypto-js/sha256");
const jwt = require('jsonwebtoken');



function generateToken(res, email,id){
    const expiration = 604800000;
    const token = jwt.sign({email, id}, process.env.TOKEN_SECRET, {
      expiresIn: '7d',
    });
    return res.cookie('token', token, {
      expires: new Date(Date.now() + expiration),
      secure: false, // set to true if your using https
      httpOnly: true
    });
}





module.exports = function (app){

    app.post('/signup', async function (req,res){
        let userData = req.body;
        let user = await User.findOne({ email: userData.email });
        if(!user){
            let pw = SHA256(userData.password);
            userData.password = pw;
            let user = new User(userData);
            user.save(function (err){
                if(err){
                    res.status(422).send("data are not correct!");
                }else{
                    generateToken(res,userData.email, user._id);
                    return res.status(201).json({
                        _id: user._id,
                        email: user.email,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        savedRecipes: user.savedRecipes,
                    });
                }
            });
        }else{
            res.status(401).send("user already exists");
        }
    });


    app.post('/login', async function(req,res){
        let userData = req.body;
        let user = await User.findOne({ email: userData.email });
        if(user){
            let pw = SHA256(userData.password);

            if(user.password === pw.toString()){
                generateToken(res, user.email, user._id); // note: user.email, not userData.email

                return res.status(200).json({
                    _id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    savedRecipes: user.savedRecipes,
                });
            }
            else{
                res.status(401).send("user or password wrong!");
            }
            
        }else{
            res.status(401).send("user does not exists");
        }
    });


    app.post('/logout', function(req,res){
        res.clearCookie('token');
        res.status(200).send("logout successful")
    });
}