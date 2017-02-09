var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');

var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var moment = require('moment');

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var Sugar = require('sugar/date');
var nodemailer = require('nodemailer');
var _ = require('lodash');

var tokenSecret = 'your unique secret';

var expenseSchema = new mongoose.Schema({
  email: String,
  time: Date,
  amount: Number,
  descrip: String
})

var userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String
})

var adminSchema = new mongoose.Schema({
  authorization: String,
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Expense = mongoose.model('Expense', expenseSchema);
var Admin = mongoose.model('Admin', adminSchema);

mongoose.connect('mongodb://localhost:27017/track');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

function ensureAuthenticated(req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization.split(' ')[1];
    try {
      var decoded = jwt.decode(token, tokenSecret);
      if (decoded.exp <= Date.now()) {
        res.send(400, 'Access token has expired');
      } else {
        req.user = decoded.user;
        return next();
      }
    } catch (err) {
      return res.send(500, 'Error parsing token');
    }
  } else {
    return res.send(401);
  }
}

function createJwtToken(user) {
  var payload = {
    user: user,
    iat: new Date().getTime(),
    exp: moment().add('days', 7).valueOf()
  };
  return jwt.encode(payload, tokenSecret);
}

app.post('/auth/signup', function(req, res, next) {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});

app.post('/auth/login', function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) return res.send(401, 'User does not exist');
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) return res.send(401, 'Invalid email and/or password');
      var token = createJwtToken(user);
      res.send({ token: token });
    });
  });
});

app.post('/auth/adminLogin', function(req, res, next) {
  Admin.findOne({ email: req.body.email, password: req.body.password}, function(err, admin) {
    if (!admin) return res.send(401, 'User does not exist');
    res.send(admin);
  });
});

app.get('/api/expenses', function(req, res, next) {
  Expense.find({ email: req.query.email }, function(err, expenses) {
    if (!expenses) return res.send(401, 'User does not exist');
    res.send(expenses);
  });
});

app.get('/api/expenses/:id', function(req, res, next) {
  Expense.findById(req.params.id, function(err, expense) {
    if (err) return next(err);
    res.send(expense);
  });
});

app.get('/api/search/:sDate/:eDate/:email', function(req, res, next) {
  if(req.params.eDate==0) {
    Expense.find({email: req.params.email, time: {$gte: req.params.sDate}}, function(err, expenses) {
    res.send(expenses);
    });
  }else if(req.params.sDate==0) {
    Expense.find({email: req.params.email, time: {$lt: req.params.eDate}}, function(err, expenses) {
    res.send(expenses);
    });
  }else {
    Expense.find({email: req.params.email, time: {$gte: req.params.sDate, $lt: req.params.eDate}}, function(err, expenses) {
    res.send(expenses);
    });
  }
});

app.get('/api/allExpenses', function(req, res, next) {
  Expense.find({}, function(err, expenses) {
    if (err) return next(err);
    res.send(expenses);
  });
});

app.post('/api/delete', function(req, res, next) {
  Expense.remove({_id: req.body._id}, function(err){
    if (err) return next(err);
  });
  Expense.findOne({email: req.body.email}, function(err, expense) {
    if (err) return next(err);
    res.send({expense});
  });
});

app.post('/auth/update', function(req, res, next) {
  Expense.update({_id:req.body.id},{email: req.body.email, time: req.body.time, amount:req.body.amount, descrip:req.body.descrip}, function(err, expense){
    if (err) return next(err);
    res.send(expense);
  });
});

app.post('/auth/add', function(req, res, next) {
  var expense = new Expense({
    email: req.body.email,
    time: req.body.time,
    amount: req.body.amount,
    descrip: req.body.descrip
  });
  Expense.collection.insert(expense, function(err, expense) {
    if(err) return next(err);
    res.send(expense);
  });
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { message: err.message });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

