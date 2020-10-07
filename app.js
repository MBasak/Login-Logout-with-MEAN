const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const app = express();
const usePassport = require('./config/passport');

mongoose.connect(config.database, {useNewUrlParser: true});

// mongoose.connection.on('connected', ()=> {
//     console.log('Connected to mongodb '+config.database);
// });

mongoose.connection
.once('open', () => {
    console.log('Connected to mongodb '+config.database);
})
.on('error', (error) => {
    console.log('Datatbase error', +error);
})

// mongoose.connection.on('error', (err) => {
//     console.log('Datatbase error');
// })
const users = require('./routes/users');

app.use(cors());

app.use(bodyParser.json()); 

app.use(passport.initialize());
app.use(passport.session());
usePassport(passport);

app.use('/users', users);
//index route
app.get('/', (req, res) => {
    res.send('Invalid endpoint');
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Server started on port ' +port);
});
