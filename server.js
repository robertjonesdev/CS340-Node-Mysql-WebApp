//Team Select Starrs - Group 10
//Robert Jones & Lauren Briese

var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var router = express.Router();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7796);

//https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Express router
app.use('/', router);

router.get('/',function(req,res,next){
    console.log("Index Get.");
    res.render('index');
});

/****************************
*         CREATE / SQL INSERT
*****************************/
/* Insert New Countries */
router.post('/countries', function(req, res, next){
    var parameters = [];
    if (req.body['name'] == '') {
      res.status(500).send({ error: "Empty name field." });
    } else {
    parameters.push(req.body['name']);
    parameters.push(req.body['space_agency_name']);
    console.log(parameters);
    mysql.pool.query("INSERT INTO country_of_origin (name, space_agency_name) VALUES (?)", [parameters], function(err, result, fields){
      if(err) throw err;
      console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);
      res.redirect('/countries');
      });
    }
});


/* Insert New Space Destinations */
router.post('/destinations', function(req, res, next){
      var parameters = [];
      if (req.body['name'] == '' || req.body['distance_from_earth'] == '') {
          res.status(500).send({ error: "Empty name or distance field." });
      } else {
      parameters.push(req.body['name']);
      parameters.push(Number(req.body['distance_from_earth']));
      console.log(parameters);
      mysql.pool.query("INSERT INTO destination (name, distance_from_earth) VALUES (?)", [parameters], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);

          res.redirect('/destinations');
      });
    }
});

/* Insert New Spacecraft */
router.post('/spacecraft', function(req, res, next){
      var parameters = [];
      if (req.body['name'] == '') {
          res.status(500).send({ error: "Empty name field." });
      } else {
      parameters.push(req.body['name']);
      parameters.push(req.body['service_start_date']);
      if (req.body['service_end_date'] == '') { parameters.push(null); }
      else { parameters.push(req.body['service_end_date']); }
      parameters.push(Number(req.body['country_id']));
      console.log(parameters);
      mysql.pool.query("INSERT INTO spacecraft (name, service_start_date, service_end_date, country_id) VALUES (?)", [parameters], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);
          res.redirect('/spacecraft');
      });
    }
});

/* Insert New Astronaut */
router.post('/astronauts', function(req, res, next){
      var parameters = [];
      if (req.body['last_name'] == '' || req.body['first_name'] == '') {
          res.status(500).send({ error: "Empty name field." });
      } else {
      parameters.push(req.body['first_name']);
      parameters.push(req.body['last_name']);
      parameters.push(req.body['birth_date']);
      if (req.body['death_date'] == '') { parameters.push(null); }
      else { parameters.push(req.body['death_date']); }
      parameters.push(Number(req.body['country_id']));
      console.log(parameters);
      mysql.pool.query("INSERT INTO astronaut (first_name, last_name, birth_date, death_date, country_id) VALUES (?)", [parameters], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);
          res.redirect('/astronauts');
      });
    }
});

/* Insert new mission */
router.post('/missions/add', function(req, res, next){
      var parameters = [];
      parameters.push(req.body['launch_date']);
      if (req.body['end_date'] == '') { parameters.push(null); }
      else { parameters.push(req.body['end_date']); }
      parameters.push(Number(req.body['success']));
      parameters.push(Number(req.body['destination_id']));
      parameters.push(Number(req.body['country_id']));
      parameters.push(Number(req.body['spacecraft_id']));
      console.log(parameters);
      mysql.pool.query("INSERT INTO mission (launch_date, end_date, success, destination_id, country_id, spacecraft_id) VALUES (?)", [parameters], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);
          res.redirect('/missions');
      });
});

/* Insert new mission to astronaut relationship from astronauts page */
router.post('/astronauts/add_mission', function(req, res, next){
      var parameters = [];
      if (req.body['mission_id'] == '' || req.body['astronaut_id'] == '') {
          res.status(500).send({ error: "Empty mission or astronaut field." });
      } else {
      parameters.push(req.body['mission_id']);
      parameters.push(req.body['astronaut_id']);
      console.log(parameters);
      mysql.pool.query("INSERT INTO mission_to_astronaut (mission_id, astronaut_id) VALUES (?)", [parameters], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);
          res.redirect('/astronauts');
      });
    }
});


/*******************************************
*       READ / SQL SELECT
*********************************************/
router.get('/missions',function(req,res,next){
    var context = {};
    //First get the country id's and names for the sort drop down box.
    mysql.pool.query('SELECT country_id, name FROM country_of_origin', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.countries = rows;
      //Next get destinations for add menu drop down box
      mysql.pool.query('SELECT destination_id, name FROM destination', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.destinations = rows;
        //Next get the spacecrafts for the add menu dro down box
        mysql.pool.query('SELECT spacecraft_id, name FROM spacecraft', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.spacecraft = rows;
              //Finally get missions
                mysql.pool.query('SELECT M1.mission_id AS mission_id, '+
                                    'DATE_FORMAT(M1.launch_date, "%Y-%m-%d") AS launch_date, '+
                                    'DATE_FORMAT(M1.end_date, "%Y-%m-%d") AS end_date, '+
                                    'M1.success AS msuccess, '+
                                    'IF(M1.success=1,"Yes","No") AS success_text, '+
                                    'D1.name AS dname, '+
                                    'D1.destination_id AS destination_id, '+
                                    'C1.name AS cname, '+
                                    'C1.country_id AS country_id, '+
                                    'S1.name AS sname, '+
                                    'S1.spacecraft_id AS spacecraft_id '+
                                    'FROM mission AS M1 '+
                                    'INNER JOIN destination AS D1 ON M1.destination_id = D1.destination_id '+
                                    'INNER JOIN country_of_origin AS C1 ON M1.country_id = C1.country_id '+
                                    'INNER JOIN spacecraft AS S1 ON M1.spacecraft_id = S1.spacecraft_id', function(err, rows, fields){
                  if(err){
                    next(err);
                    return;
                  }
                  context.results = rows;
                  console.log("Select Missions [0...i]: " + context.results[0]);
                  res.render('missions', context);
                });
            });
        });
    });
});

router.get('/missions/:country_id',function(req,res,next){
    var context = {};
    //First get the country id's and names for the sort drop down box.
    mysql.pool.query('SELECT country_id, name FROM country_of_origin', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.countries = rows;
      //Next get destinations for add menu drop down box
      mysql.pool.query('SELECT destination_id, name FROM destination', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.destinations = rows;
        //Next get the spacecrafts for the add menu dro down box
        mysql.pool.query('SELECT spacecraft_id, name FROM spacecraft', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.spacecraft = rows;
              //Finally get missions
                mysql.pool.query('SELECT M1.mission_id AS mission_id, '+
                                    'DATE_FORMAT(M1.launch_date, "%Y-%m-%d") AS launch_date, '+
                                    'DATE_FORMAT(M1.end_date, "%Y-%m-%d") AS end_date, '+
                                    'M1.success AS msuccess, '+
                                    'IF(M1.success=1,"Yes","No") AS success_text, '+
                                    'D1.name AS dname, '+
                                    'D1.destination_id AS destination_id, '+
                                    'C1.name AS cname, '+
                                    'C1.country_id AS country_id, '+
                                    'S1.name AS sname, '+
                                    'S1.spacecraft_id AS spacecraft_id '+
                                    'FROM mission AS M1 '+
                                    'INNER JOIN destination AS D1 ON M1.destination_id = D1.destination_id '+
                                    'INNER JOIN country_of_origin AS C1 ON M1.country_id = C1.country_id '+
                                    'INNER JOIN spacecraft AS S1 ON M1.spacecraft_id = S1.spacecraft_id ' +
                                    'WHERE C1.country_id = ' + req.params.country_id, function(err, rows, fields){
                  if(err){
                    next(err);
                    return;
                  }
                  context.results = rows;
                  console.log("Select Missions [0...i]: " + context.results[0]);
                  res.render('missions', context);
                });
            });
        });
    });
});

router.get('/astronauts',function(req,res,next){
    var context = {};
    //First get the country id's and names for the sort drop down box.
    mysql.pool.query('SELECT country_id, name FROM country_of_origin', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.countries = rows;

        mysql.pool.query('SELECT A1.astronaut_id AS astronaut_id, '+
                            'A1.first_name AS first_name, '+
                            'A1.last_name AS last_name, '+
                            'DATE_FORMAT(A1.birth_date, "%Y-%m-%d") AS birth_date, '+
                            'DATE_FORMAT(A1.death_date, "%Y-%m-%d", NULL) AS death_date, '+
                            'C1.name AS cname, '+
                            'C1.country_id AS country_id '+
                            'FROM astronaut AS A1 '+
                            'LEFT JOIN country_of_origin AS C1 ON A1.country_id = C1.country_id', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.results = rows;
          console.log("Select Astronauts [0...i]: " + context.results[0]);
          res.render('astronauts', context);
        });
    });
});

router.get('/astronauts/:country_id',function(req,res,next){
    if(isNaN(req.params.country_id)) {
        res.render('astronauts', context);
    }
    else {
    var context = {};
    //First get the country id's and names for the sort drop down box.
    mysql.pool.query('SELECT country_id, name FROM country_of_origin', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.countries = rows;

        mysql.pool.query('SELECT A1.astronaut_id AS astronaut_id, '+
                            'A1.first_name AS first_name, '+
                            'A1.last_name AS last_name, '+
                            'DATE_FORMAT(A1.birth_date, "%Y-%m-%d") AS birth_date, '+
                            'DATE_FORMAT(A1.death_date, "%Y-%m-%d", NULL) AS death_date, '+
                            'C1.name AS cname, '+
                            'C1.country_id AS country_id '+
                            'FROM astronaut AS A1 '+
                            'INNER JOIN country_of_origin AS C1 ON A1.country_id = C1.country_id ' +
                            'WHERE C1.country_id = ' + req.params.country_id, function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.results = rows;
          console.log("Select Astronauts [0...i]: " + context.results[0]);
          res.render('astronauts', context);
        });
    });
    }
});

router.get('/astronauts/:mission_id',function(req,res,next){
    if(isNaN(req.params.mission_id)) {
        res.render('astronauts', context);
    }
    else {
    var context = {};
    //First get the mission IDs and names for the sort drop down box.
    mysql.pool.query('SELECT mission_id FROM mission', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.missions = rows;

        mysql.pool.query('SELECT M1.mission_id AS mission_id, '+
                                    'DATE_FORMAT(M1.launch_date, "%Y-%m-%d") AS launch_date, '+
                                    'DATE_FORMAT(M1.end_date, "%Y-%m-%d") AS end_date, '+
                                    'M1.success AS msuccess, '+
                                    'IF(M1.success=1,"Yes","No") AS success_text, '+
                                    'D1.name AS dname, '+
                                    'D1.destination_id AS destination_id, '+
                                    'C1.name AS cname, '+
                                    'C1.country_id AS country_id, '+
                                    'S1.name AS sname, '+
                                    'S1.spacecraft_id AS spacecraft_id '+
                                    'FROM mission AS M1 '+
                                    'INNER JOIN destination AS D1 ON M1.destination_id = D1.destination_id '+
                                    'INNER JOIN country_of_origin AS C1 ON M1.country_id = C1.country_id '+
                                    'INNER JOIN spacecraft AS S1 ON M1.spacecraft_id = S1.spacecraft_id', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.results = rows;
          res.render('astronauts', context);
        });
    });
    }
});

// Get Mission to Astronaut relationship
// This is used for an AJAX call by Missions page (no handlebars)
router.get('/ma',function(req,res,next){
    var context = {};
    //First get the country id's and names for the sort drop down box.

        mysql.pool.query('SELECT A1.astronaut_id AS astronaut_id, '+
                            'A1.first_name AS first_name, '+
                            'A1.last_name AS last_name, '+
                            'M1.mission_id AS mission_id '+
                            'FROM astronaut AS A1 '+
                            'INNER JOIN mission_to_astronaut AS MA1 ON A1.astronaut_id = MA1.astronaut_id '+
                            'INNER JOIN mission AS M1 ON MA1.mission_id = M1.mission_id', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.results = rows;
          console.log("Select Mission to Astronauts " + context.results[0]);
          res.send(JSON.stringify(rows));
        });
});

//Get Astronaut to Mission relationship
// This is used for an AJAX call by Astronauts page.
router.get('/am',function(req,res,next){
    var context = {};
        mysql.pool.query('SELECT M1.mission_id AS mission_id, '+
                            'A1.astronaut_id AS astronaut_id, '+
                            'DATE_FORMAT(M1.launch_date, "%Y-%m-%d") AS launch_date, '+
                            'DATE_FORMAT(M1.end_date, "%Y-%m-%d") AS end_date, '+
                            'D1.name AS dname, '+
                            'S1.name AS sname '+
                            'FROM mission AS M1 '+
                            'INNER JOIN mission_to_astronaut AS MA1 ON M1.mission_id = MA1.mission_id '+
                            'INNER JOIN astronaut AS A1 ON MA1.astronaut_id = A1.astronaut_id '+
                            'INNER JOIN destination AS D1 ON M1.destination_id = D1.destination_id '+
                            'INNER JOIN spacecraft AS S1 ON M1.spacecraft_id = S1.spacecraft_id', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.results = rows;
          console.log("Select Mission to Astronauts " + context.results[0]);
          res.send(JSON.stringify(rows));
        });
});

router.get('/spacecraft',function(req,res,next){
    var context = {};
    //First get the country id's and names for the sort drop down box.
    mysql.pool.query('SELECT country_id, name FROM country_of_origin', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.countries = rows;

        //Next, get the spacecraft and render page.
        mysql.pool.query('SELECT S1.spacecraft_id AS spacecraft_id, '+
                            'S1.name AS name, '+
                            'DATE_FORMAT(S1.service_start_date, "%Y-%m-%d") AS service_start_date, '+
                            'DATE_FORMAT(S1.service_end_date, "%Y-%m-%d", NULL) AS service_end_date, '+
                            'C1.name AS cname, '+
                            'C1.country_id AS country_id '+
                            'FROM spacecraft AS S1 '+
                            'INNER JOIN country_of_origin AS C1 ON S1.country_id = C1.country_id', function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.results = rows;
          console.log("Select Spacecraft [0...i]: " + context.results[0]);
          res.render('spacecraft', context);
        });
    });
});

router.get('/destinations',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM destination', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      console.log("Select Destinations [0...i]: " + context.results[0]);
      res.render('destinations', context);
    });
});

router.get('/destinations/desc',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM destination ORDER BY distance_from_earth DESC', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      console.log("Select Destinations [0...i]: " + context.results[0]);
      res.render('destinations', context);
    });
});

router.get('/destinations/asc',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM destination ORDER BY distance_from_earth ASC', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      console.log("Select Destinations [0...i]: " + context.results[0]);
      res.render('destinations', context);
    });
});

router.get('/countries',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM country_of_origin', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.results = rows;
      console.log("Select Countries [0...i]: " + context.results[0]);
      res.render('countries', context);
    });
});

/*Display spacecraft for a specific country by country_id */
router.get('/spacecraft/:country_id',function(req,res,next){
    var context = {};
    //First get the country id's and names for the sort drop down box.
    mysql.pool.query('SELECT country_id, name FROM country_of_origin', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.countries = rows;
        //Next, get the spacecraft and render page.
        mysql.pool.query('SELECT S1.spacecraft_id AS spacecraft_id, '+
                            'S1.name AS name, '+
                            'DATE_FORMAT(S1.service_start_date, "%Y-%m-%d") AS service_start_date, '+
                            'DATE_FORMAT(S1.service_end_date, "%Y-%m-%d", NULL) AS service_end_date, '+
                            'C1.name AS cname '+
                            'FROM spacecraft AS S1 '+
                            'INNER JOIN country_of_origin AS C1 ON S1.country_id = C1.country_id '+
                            'WHERE S1.country_id = ' + req.params.country_id, function(err, rows, fields){
          if(err){
            next(err);
            return;
          }
          context.results = rows;
          console.log("Select Spacecraft [0...i]: " + context.results[0]);
          res.render('spacecraft', context);
        });
    });
});


router.get('/missions_to_astronauts',function(req,res,next){
    var context = {};
    //First get the mission id's and names for the add menu drop down box
    mysql.pool.query('SELECT mission_id from mission', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
      context.missions = rows;
      //Next get astronaut_id for add menu drop down box
      mysql.pool.query('SELECT astronaut_id, first_name, last_name FROM astronaut', function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.astronauts = rows;
                mysql.pool.query('SELECT M1.mission_id AS mission_id, '+
                                    'A1.astronaut_id AS astronaut_id, '+
                                    'A1.first_name AS first_name, '+
                                    'A1.last_name AS last_name '+
                                    'FROM mission_to_astronaut MA1 '+
                                    'INNER JOIN astronaut AS A1 ON MA1.astronaut_id = A1.astronaut_id '+
                                    'INNER JOIN mission AS M1 ON MA1.mission_id = M1.mission_id', function(err, rows, fields){
                  if(err){
                    next(err);
                    return;
                  }
                  context.results = rows;
                  console.log("Select Missions to Astronauts [0...i]: " + context.results[0]);
                  res.render('missions_to_astronauts', context);
                });
        });
    });
});

/****************************
*         DELETE
*****************************/
/*Delete specific mission*/
router.get('/missions/delete/:mission_id', function(req, res, next){

       console.log("delete " + req.params.mission_id);
       mysql.pool.query('DELETE FROM mission WHERE mission_id=? ', req.params.mission_id, function(err, result) {
           if (err) throw err;
           console.log("Number of records deleted: " + result.affectedRows);
           res.redirect('/missions');
      });
 });

/*Delete specific astronaut*/
router.get('/astronauts/delete/:astronaut_id', function(req, res, next){

    console.log("delete " + req.params.astronaut_id);
    mysql.pool.query('DELETE FROM astronaut WHERE astronaut_id=? ', req.params.astronaut_id, function(err, result) {
        if (err) throw err;
        console.log("Number of records deleted: " + result.affectedRows);
        res.redirect('/astronauts');
   });
});

/*Delete specific mission from astronaut */
router.get('/astronauts/delete_m2a/:mission_id/:astronaut_id', function(req, res, next){

     console.log("delete " + req.params.mission_id + " " + req.params.astronaut_id);
     mysql.pool.query('DELETE FROM mission_to_astronaut WHERE mission_id=? AND astronaut_id=? LIMIT 1', [req.params.mission_id, req.params.astronaut_id], function(err, result) {
         if (err) throw err;
         console.log("Number of records deleted: " + result.affectedRows);
         res.redirect('/astronauts');
    });
});

/*Delete specific astronaut from mission */
router.get('/missions/delete_m2a/:mission_id/:astronaut_id', function(req, res, next){

     console.log("delete " + req.params.mission_id + " " + req.params.astronaut_id);
     mysql.pool.query('DELETE FROM mission_to_astronaut WHERE mission_id=? AND astronaut_id=? LIMIT 1', [req.params.mission_id, req.params.astronaut_id], function(err, result) {
         if (err) throw err;
         console.log("Number of records deleted: " + result.affectedRows);
         res.redirect('/missions');
    });
});

/*Delete specific spacecraft*/
router.get('/spacecraft/delete/:spacecraft_id', function(req, res, next){

     console.log("delete " + req.params.spacecraft_id);
     mysql.pool.query('DELETE FROM spacecraft WHERE spacecraft_id=? ', req.params.spacecraft_id, function(err, result) {
         if (err) throw err;
         console.log("Number of records deleted: " + result.affectedRows);
         res.redirect('/spacecraft');
    });
});

/*Delete specific space destination*/
router.get('/destination/delete/:destination_id', function(req, res, next){

     console.log("delete " + req.params.destination_id);
     mysql.pool.query('DELETE FROM destination WHERE destination_id=? ', req.params.destination_id, function(err, result) {
         if (err) throw err;
         console.log("Number of records deleted: " + result.affectedRows);
         res.redirect('/destinations');
    });
});

/*Delete specific space destination*/
router.get('/countries/delete/:country_id', function(req, res, next){

     console.log("delete " + req.params.country_id);
     mysql.pool.query('DELETE FROM country_of_origin WHERE country_id=? ', req.params.country_id, function(err, result) {
         if (err) throw err;
         console.log("Number of records deleted: " + result.affectedRows);
         res.redirect('/countries');
    });
});

/*Delete specific mission-to-astronaut */
router.get('/missions_to_astronauts/delete/:mission_id/:astronaut_id', function(req, res, next){

     console.log("delete " + req.params.mission_id + " " + req.params.astronaut_id);
     mysql.pool.query('DELETE FROM mission_to_astronaut WHERE mission_id=? AND astronaut_id=?', [req.params.mission_id, req.params.astronaut_id], function(err, result) {
         if (err) throw err;
         console.log("Number of records deleted: " + result.affectedRows);
         res.redirect('/mission_to_astronaut');
    });
});

/****************************
*         UPDATE / EDIT
*****************************/
router.post('/missions/update', function(req, res, next){
    mysql.pool.query("SELECT * FROM mission WHERE mission_id=?", [Number(req.body['mission_id'])], function(err, result){
        if(err){ next(err); return; }
        if (result.length == 1) {
            var curVals = result[0];
            var parameters = [];
            parameters.push("'" + req.body['launch_date'] + "'" || curVals.launch_date);
            if (req.body['end_date'] == '') {
                parameters.push(null);
            }
            else {
                parameters.push("'" + req.body['end_date'] + "'");
            }
            parameters.push(Number(req.body['success'])) || curVals.success;
            parameters.push(Number(req.body['destination_id']) || curVals.destination_id);
            parameters.push(Number(req.body['country_id']) || curVals.country_id);
            parameters.push(Number(req.body['spacecraft_id']) || curVals.spacecraft_id);
            parameters.push(Number(req.body['mission_id']));
            console.log(parameters);
            mysql.pool.query('UPDATE mission SET'+
                              ' launch_date='+ parameters[0] +
                              ', end_date='+ parameters[1] +
                              ', success='+ parameters[2] +
                              ', destination_id='+ parameters[3] +
                              ', country_id='+ parameters[4] +
                              ', spacecraft_id='+ parameters[5] +
                              ' WHERE mission_id='+ parameters[6], function(err, result, fields){
              if(err) throw err;
              console.log("Number of records updated: " + result.affectedRows + " with id ");
              res.redirect('/missions');
            });
        }
    });
});

router.post('/astronauts/update', function(req, res, next){
    mysql.pool.query("SELECT * FROM astronaut WHERE astronaut_id=?", [Number(req.body['astronaut_id'])], function(err, result){
        if(err){ next(err); return; }
        if (result.length == 1) {
            var curVals = result[0];
            var parameters = [];
            parameters.push("'" + req.body['first_name'] + "'" || curVals.first_name);
            parameters.push("'" + req.body['last_name']  + "'" || curVals.last_name);
            parameters.push("'" + req.body['birth_date'] + "'" || curVals.birth_date);
            if (req.body['death_date'] == '') {
                parameters.push(null);
            }
            else {
                parameters.push("'" + req.body['death_date'] + "'");
            }
            parameters.push(Number(req.body['country_id']) || curVals.country_id);
            parameters.push(Number(req.body['astronaut_id']) || curVals.astronaut_id);
            console.log(parameters);
            mysql.pool.query('UPDATE astronaut SET'+
                              ' first_name='+ parameters[0] +
                              ', last_name='+ parameters[1] +
                              ', birth_date='+ parameters[2] +
                              ', death_date='+ parameters[3] +
                              ', country_id='+ parameters[4] +
                              ' WHERE astronaut_id='+ parameters[5], function(err, result, fields){
              if(err) throw err;
              console.log("Number of records updated: " + result.affectedRows + " with id ");
              res.redirect('/astronauts');
            });
        }
    });
});

router.post('/countries/update', function(req, res, next){
    mysql.pool.query("SELECT * FROM country_of_origin WHERE country_id=?", [Number(req.body['country_id'])], function(err, result){
        if(err){ next(err); return; }
        if (result.length == 1) {
            var curVals = result[0];
            var parameters = [];
            parameters.push("'" + req.body['name'] + "'" || curVals.name);
            parameters.push("'" + req.body['space_agency_name'] + "'" || curVals.space_agency_name);
            parameters.push(Number(req.body['country_id']) || curVals.country_id);
            console.log(parameters);
            mysql.pool.query('UPDATE country_of_origin SET'+
                              ' name='+ parameters[0] +
                              ', space_agency_name='+ parameters[1] +
                              ' WHERE country_id='+ parameters[2], function(err, result, fields){
              if(err) throw err;
              console.log("Number of country records updated: " + result.affectedRows + " with id ");
              res.redirect('/countries');
            });
        }
    });
});

router.post('/spacecraft/update', function(req, res, next){
    mysql.pool.query("SELECT * FROM spacecraft WHERE spacecraft_id=?", [Number(req.body['spacecraft_id'])], function(err, result){
        if(err){ next(err); return; }
        if (result.length == 1) {
            var curVals = result[0];
            var parameters = [];
            parameters.push("'" + req.body['name'] + "'" || curVals.name);
            parameters.push("'" + req.body['service_start_date'] + "'" || curVals.service_start_date);
            if (req.body['service_end_date'] == '') {
                parameters.push(null);
            }
            else {
                parameters.push("'" + req.body['service_end_date'] + "'");
            }
            parameters.push(Number(req.body['country_id']) || curVals.country_id);
            parameters.push(Number(req.body['spacecraft_id']) || curVals.spacecraft_id);
            console.log(parameters);
            mysql.pool.query('UPDATE spacecraft SET'+
                              ' name='+ parameters[0] +
                              ', service_start_date='+ parameters[1] +
                              ', service_end_date='+ parameters[2] +
                              ', country_id='+ parameters[3] +
                              ' WHERE spacecraft_id='+ parameters[4], function(err, result, fields){
              if(err) throw err;
              console.log("Number of spacecraft records updated: " + result.affectedRows + " with id ");
              res.redirect('/spacecraft');
            });
        }
    });
});

router.post('/destinations/update', function(req, res, next){
    mysql.pool.query("SELECT * FROM destination WHERE destination_id=?", [Number(req.body['destination_id'])], function(err, result){
        if(err){ next(err); return; }
        if (result.length == 1) {
            var curVals = result[0];
            var parameters = [];
            parameters.push("'" + req.body['name'] + "'" || curVals.name);
            parameters.push(Number(req.body['distance_from_earth']) || curVals.distance_from_earth);
            parameters.push(Number(req.body['destination_id']) || curVals.destination_id);
            console.log(parameters);
            mysql.pool.query('UPDATE destination SET'+
                              ' name='+ parameters[0] +
                              ', distance_from_earth='+ parameters[1] +
                              ' WHERE destination_id='+ parameters[2], function(err, result, fields){
              if(err) throw err;
              console.log("Number of destination records updated: " + result.affectedRows + " with id ");
              res.redirect('/destinations');
            });
        }
    });
});

/****************************
*   SQL Connection Status
*****************************/
mysql.pool.getConnection(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

/****************************
*   Node Server Start Status
*****************************/
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
