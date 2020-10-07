const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

router.post('/register', (req,res,next) => {
  let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
  });

  User.addUser(newUser, (err,user) => {
      if(err){
          res.json({success: false, msg:'Failed to register user' +err});
      } else {
          
            res.json({success: true, msg: 'Registered successfully', user:user});
      }
  })
});

router.post('/authenticate', (req, res, next) => {
   const username = req.body.username;
   const password = req.body.password;
   
   User.getUserByUsername(username, (error, user) => {
    
    if(error) {
     
        throw error;
       
    }
    if(!user)
    {
        return res.json({success: false, msg:'User not found'});
    }

    User.comparePassword( password, user.password,(error, isMatch) => {
       
        if(error) {
        throw error;
        }
        if(isMatch)
        {
            const token = jwt.sign({data:user}, config.secret, {
                expiresIn: 604800
            });

            res.json({success: true,
            token: token,
        user : {
            id: user._id,
            name: user.username,
            email: user.email
        }});
        }
        else{
            res.json({success: false, msg:'Password is incorrect'});
        }

    })
   })
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    console.log(res);
   res.json({user: req.user});
});


module.exports = router;