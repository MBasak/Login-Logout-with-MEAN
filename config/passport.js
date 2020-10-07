const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports  = function(passport)
{
    
    let opts = {};
     opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('token');
     opts.secretOrKey = config.secret;
     
     passport.use(new JwtStrategy(opts, (jwt_payload,done) =>{
        console.log(jwt_payload);
        User.getUserById(jwt_payload.data._id, (error, user) => {
            if(error)
            {
                return done(error, false);
            }
            if(user)
            {
                return done(null, user);
            }
            return done(null, false);
        })
     }));
}
