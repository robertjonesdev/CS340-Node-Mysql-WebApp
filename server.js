//Robert Jones - Activity Tracker

var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7798);

//https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// CRUD Design Pattern: Create Read Update Delete

/****************************
*         CREATE / SQL INSERT
*****************************/

/* Insert New Countries */
app.post('/countries', function(req, res, next){
      var pParams = [];
      if (req.body['name'] == '') {
          res.status(500).send({ error: "Empty name field." });
      } else {
      pParams.push(req.body['name']);
      pParams.push(req.body['space_agency_name']);
      console.log(pParams);
      mysql.pool.query("INSERT INTO country_of_origin (name, space_agency_name) VALUES (?)", [pParams], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);

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
    }
});


/* Insert New Space Destinations */
app.post('/destinations', function(req, res, next){
      var pParams = [];
      if (req.body['name'] == '' || req.body['distance_from_earth'] == '') {
          res.status(500).send({ error: "Empty name or distance field." });
      } else {
      pParams.push(req.body['name']);
      pParams.push(Number(req.body['distance_from_earth']));
      console.log(pParams);
      mysql.pool.query("INSERT INTO destination (name, distance_from_earth) VALUES (?)", [pParams], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);

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
    }
});

/* Insert New Spacecraft */
app.post('/spacecraft', function(req, res, next){
      var pParams = [];
      if (req.body['name'] == '') {
          res.status(500).send({ error: "Empty name field." });
      } else {
      pParams.push(req.body['name']);
      pParams.push(req.body['service_start_date']);
      if (req.body['service_end_date'] == '') { pParams.push(null); }
      else { pParams.push(req.body['service_end_date']); }
      pParams.push(Number(req.body['country_id']));
      console.log(pParams);
      mysql.pool.query("INSERT INTO spacecraft (name, service_start_date, service_end_date, country_id) VALUES (?)", [pParams], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);

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
    }
});

/* Insert New Astronaut */
app.post('/astronauts', function(req, res, next){
      var pParams = [];
      if (req.body['last_name'] == '' || req.body['first_name'] == '') {
          res.status(500).send({ error: "Empty name field." });
      } else {
      pParams.push(req.body['first_name']);
      pParams.push(req.body['last_name']);
      pParams.push(req.body['birth_date']);
      if (req.body['death_date'] == '') { pParams.push(null); }
      else { pParams.push(req.body['death_date']); }
      pParams.push(Number(req.body['country_id']));
      console.log(pParams);
      mysql.pool.query("INSERT INTO astronaut (first_name, last_name, birth_date, death_date, country_id) VALUES (?)", [pParams], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);

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
                                  'C1.name AS cname '+
                                  'FROM astronaut AS A1 '+
                                  'INNER JOIN country_of_origin AS C1 ON A1.country_id = C1.country_id', function(err, rows, fields){
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
    }
});

/* Insert new mission */
app.post('/missions', function(req, res, next){
      var pParams = [];
      pParams.push(req.body['launch_date']);
      if (req.body['end_date'] == '') { pParams.push(null); }
      else { pParams.push(req.body['end_date']); }
      pParams.push(Number(req.body['success']));
      pParams.push(Number(req.body['destination_id']));
      pParams.push(Number(req.body['country_id']));
      pParams.push(Number(req.body['spacecraft_id']));
      console.log(pParams);
      mysql.pool.query("INSERT INTO mission (launch_date, end_date, success, destination_id, country_id, spacecraft_id) VALUES (?)", [pParams], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);
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
                                          'D1.name AS dname, '+
                                          'C1.name AS cname, '+
                                          'S1.name AS sname '+
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
});


/*******************************************
*       READ / SQL SELECT
*********************************************/
app.get('/',function(req,res,next){
    console.log("Index Get.");
    res.render('index');
});

app.get('/missions',function(req,res,next){
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
                                    'D1.name AS dname, '+
                                    'C1.name AS cname, '+
                                    'S1.name AS sname '+
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

app.get('/missions/:country_id',function(req,res,next){
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
                                    'D1.name AS dname, '+
                                    'C1.name AS cname, '+
                                    'S1.name AS sname '+
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

app.get('/astronauts',function(req,res,next){
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
                            'C1.name AS cname '+
                            'FROM astronaut AS A1 '+
                            'INNER JOIN country_of_origin AS C1 ON A1.country_id = C1.country_id', function(err, rows, fields){
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

app.get('/astronauts/:country_id',function(req,res,next){
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
                            'C1.name AS cname '+
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
});

app.get('/spacecraft',function(req,res,next){
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

app.get('/destinations',function(req,res,next){
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

app.get('/destinations/desc',function(req,res,next){
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

app.get('/destinations/asc',function(req,res,next){
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

app.get('/countries',function(req,res,next){
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
app.get('/spacecraft/:country_id',function(req,res,next){
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


/****************************
*         DELETE
*****************************/
// app.post('/delete', function(req, res, next){
//   if (req.body['request'] == "delete") {
//       console.log("delete " + req.body['id']);
//       mysql.pool.query('DELETE FROM workouts WHERE id=? ',[req.body['id']], function(err, result) {
//           if (err) throw err;
//           console.log("Number of records deleted: " + result.affectedRows);
//           res.send(JSON.stringify(req.body['id']));
//       });
//
//   }
// });

/****************************
*         UPDATE / EDIT
*****************************/
// app.post('/edit', function(req, res, next){
//    if (req.body['request'] == 'edit') {
//       console.log("Edit request for ID #: " + req.body['id']);
//       if (req.body['name'] == '') {
//           res.status(500).send({ error: "Empty name field." });
//       } else {
//       mysql.pool.query("SELECT * FROM workouts WHERE id=?", [Number(req.body['id'])], function(err, result){
//         if(err){
//           next(err);
//           return;
//         }
//         console.log("Results affected: " + result.length);
//         if (result.length == 1) {
//           var curVals = result[0];
//           let sql = "UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?";
//           let data =  [req.body['name'] || curVals.name, Number(req.body['reps']) || Number(curVals.reps), Number(req.body['weight']) ||
//                 Number(curVals.weight), req.body['date'] || curVals.date, Number(req.body['lbs']), Number(req.body['id'])];
//           mysql.pool.query(sql,data, function(err, result, fields){
//                 if(err){
//                   next(err);
//                   return;
//                 }
//             mysql.pool.query('SELECT * FROM workouts WHERE id =' + req.body['id'], function(err, rows, fields){
//               if(err){
//                 next(err);
//                 return;
//               }
//               res.send(JSON.stringify(rows));
//             });
//           });
//         } else {
//             console.log("Edit error");
//         }
//       });
//      }
//  }
//  });

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
