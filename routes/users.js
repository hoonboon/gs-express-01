var express = require('express');
var router = express.Router();

var ObjectID = require('mongodb').ObjectID;

var baseDir = "users/";

/* TODO: Use service to handle all database requests */

/* GET Userlist page. */
router.get('/list', function(req, res) {
  var db = req.db;
  var collection = db.get('users');
  collection.find({},{},function(e,docs){
    res.render(baseDir+'list', {
      "userlist" : docs
    });
  });
});

/* GET New User page. */
router.get('/new', function(req, res) {
  res.render(baseDir+'new', { title: 'Add New User' });
});

/* POST to Save New User Service */
router.post('/saveNew', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;

  // Set our collection
  var collection = db.get('users');

  // Submit to the DB
  collection.insert({
    "username" : userName,
    "email" : userEmail
  }, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem adding the information to the database.");
    }
    else {
      // And forward to success page
      res.redirect("list");
    }
  });
});

/* GET Edit User page. */
router.get('/edit', function(req, res) {
  var db = req.db;
  
  // Get parameters
  var idStr = req.query.id;
  var objId = new ObjectID(idStr); 
  
  var collection = db.get('users');
  collection.findOne({_id: objId},{},function(e,doc){
    res.render(baseDir+'edit', {
      title: 'Edit User',
      user : doc
    });
  });
});

/* PUT to Save Edit User Service */
router.put('/saveEdit', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var idStr = req.body.id;
  var objId = new ObjectID(idStr); 

  var userName = req.body.username;
  var userEmail = req.body.useremail;

  // Set our collection
  var collection = db.get('users');

  // Submit to the DB
  collection.findOneAndUpdate({
    _id: objId
  }, {
    "username" : userName,
    "email" : userEmail
  }, {}, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem updating the information to the database.");
    }
    else {
      // And forward to success page
      res.redirect("list");
    }
  });
});

/* DELETE to Save Delete User Service */
router.delete('/saveDelete', function(req, res) {

  // Set our internal DB variable
  var db = req.db;

  // Get our form values. These rely on the "name" attributes
  var idStr = req.body.id;
  var objId = new ObjectID(idStr); 
  
  // Set our collection
  var collection = db.get('users');

  // Submit to the DB
  collection.remove({
    _id: objId
  }, {}, function (err, doc) {
    if (err) {
      // If it failed, return error
      res.send("There was a problem updating the information to the database.");
    }
    else {
      // And forward to success page
      res.redirect("list");
    }
  });
});

module.exports = router;
