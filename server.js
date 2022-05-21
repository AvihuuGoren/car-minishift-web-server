//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null) {
  var mongoHost, mongoPort, mongoDatabase, mongoPassword, mongoUser;
  // If using plane old env vars via service discovery
  if (process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    mongoUser = process.env[mongoServiceName + '_USER'];

  // If using env vars from secret from service binding  
  } else if (process.env.database_name) {
    mongoDatabase = process.env.database_name;
    mongoPassword = process.env.password;
    mongoUser = process.env.username;
    var mongoUriParts = process.env.uri && process.env.uri.split("//");
    if (mongoUriParts.length == 2) {
      mongoUriParts = mongoUriParts[1].split(":");
      if (mongoUriParts && mongoUriParts.length == 2) {
        mongoHost = mongoUriParts[0];
        mongoPort = mongoUriParts[1];
      }
    }
  }

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
    buildb(db);
  });
};

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    var col = db.collection('counts');
    // Create a document with request IP and current time of request
    col.insert({ip: req.ip, date: Date.now()});
    col.count(function(err, count){
      if (err) {
        console.log('Error running count. Message:\n'+err);
      }
      res.render('index.html', { pageCountMessage : count, dbInfo: dbDetails });
    });
  } else {
    res.render('index.html', { pageCountMessage : null});
  }
});

app.get('/pagecount', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  if (!db) {
    initDb(function(err){});
  }
  if (db) {
    db.collection('counts').count(function(err, count ){
      res.send('{ pageCount: ' + count + '}');
    });
  } else {
    res.send('{ pageCount: -1 }');
  }
});

app.get('/weighthGreaterThen/:weight', function (req, res, next) {
   
  if (!db) {
    initDb(function(err){});
  }
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb3");
      console.log(req.params.weight);
      var query = { Weight_in_lbs: {$gt:Number(req.params.weight)}};
      console.log(query)
      dbo.collection("cars").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result)
        db.close();
      });
    });
})

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
function buildb()
{
  if (!db) {
    initDb(function(err){});
  }
  var dbo = db.collection('cars');
  var dbo = db.db("mydb3");
var myobj = [
  {
     "Name":"chevrolet chevelle malibu",
     "Miles_per_Gallon":18,
     "Cylinders":8,
     "Displacement":307,
     "Horsepower":130,
     "Weight_in_lbs":3504,
     "Acceleration":12,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick skylark 320",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":165,
     "Weight_in_lbs":3693,
     "Acceleration":11.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth satellite",
     "Miles_per_Gallon":18,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":3436,
     "Acceleration":11,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc rebel sst",
     "Miles_per_Gallon":16,
     "Cylinders":8,
     "Displacement":304,
     "Horsepower":150,
     "Weight_in_lbs":3433,
     "Acceleration":12,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford torino",
     "Miles_per_Gallon":17,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":140,
     "Weight_in_lbs":3449,
     "Acceleration":10.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford galaxie 500",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":429,
     "Horsepower":198,
     "Weight_in_lbs":4341,
     "Acceleration":10,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet impala",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":454,
     "Horsepower":220,
     "Weight_in_lbs":4354,
     "Acceleration":9,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth fury iii",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":440,
     "Horsepower":215,
     "Weight_in_lbs":4312,
     "Acceleration":8.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac catalina",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":455,
     "Horsepower":225,
     "Weight_in_lbs":4425,
     "Acceleration":10,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc ambassador dpl",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":390,
     "Horsepower":190,
     "Weight_in_lbs":3850,
     "Acceleration":8.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"citroen ds-21 pallas",
     "Miles_per_Gallon":null,
     "Cylinders":4,
     "Displacement":133,
     "Horsepower":115,
     "Weight_in_lbs":3090,
     "Acceleration":17.5,
     "Year":"1970-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"chevrolet chevelle concours (sw)",
     "Miles_per_Gallon":null,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":165,
     "Weight_in_lbs":4142,
     "Acceleration":11.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford torino (sw)",
     "Miles_per_Gallon":null,
     "Cylinders":8,
     "Displacement":351,
     "Horsepower":153,
     "Weight_in_lbs":4034,
     "Acceleration":11,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth satellite (sw)",
     "Miles_per_Gallon":null,
     "Cylinders":8,
     "Displacement":383,
     "Horsepower":175,
     "Weight_in_lbs":4166,
     "Acceleration":10.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc rebel sst (sw)",
     "Miles_per_Gallon":null,
     "Cylinders":8,
     "Displacement":360,
     "Horsepower":175,
     "Weight_in_lbs":3850,
     "Acceleration":11,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge challenger se",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":383,
     "Horsepower":170,
     "Weight_in_lbs":3563,
     "Acceleration":10,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth 'cuda 340",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":340,
     "Horsepower":160,
     "Weight_in_lbs":3609,
     "Acceleration":8,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford mustang boss 302",
     "Miles_per_Gallon":null,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":140,
     "Weight_in_lbs":3353,
     "Acceleration":8,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet monte carlo",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":150,
     "Weight_in_lbs":3761,
     "Acceleration":9.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick estate wagon (sw)",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":455,
     "Horsepower":225,
     "Weight_in_lbs":3086,
     "Acceleration":10,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota corona mark ii",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":113,
     "Horsepower":95,
     "Weight_in_lbs":2372,
     "Acceleration":15,
     "Year":"1970-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"plymouth duster",
     "Miles_per_Gallon":22,
     "Cylinders":6,
     "Displacement":198,
     "Horsepower":95,
     "Weight_in_lbs":2833,
     "Acceleration":15.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc hornet",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":199,
     "Horsepower":97,
     "Weight_in_lbs":2774,
     "Acceleration":15.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford maverick",
     "Miles_per_Gallon":21,
     "Cylinders":6,
     "Displacement":200,
     "Horsepower":85,
     "Weight_in_lbs":2587,
     "Acceleration":16,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun pl510",
     "Miles_per_Gallon":27,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":88,
     "Weight_in_lbs":2130,
     "Acceleration":14.5,
     "Year":"1970-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"volkswagen 1131 deluxe sedan",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":46,
     "Weight_in_lbs":1835,
     "Acceleration":20.5,
     "Year":"1970-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"peugeot 504",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":110,
     "Horsepower":87,
     "Weight_in_lbs":2672,
     "Acceleration":17.5,
     "Year":"1970-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"audi 100 ls",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":107,
     "Horsepower":90,
     "Weight_in_lbs":2430,
     "Acceleration":14.5,
     "Year":"1970-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"saab 99e",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":104,
     "Horsepower":95,
     "Weight_in_lbs":2375,
     "Acceleration":17.5,
     "Year":"1970-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"bmw 2002",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":113,
     "Weight_in_lbs":2234,
     "Acceleration":12.5,
     "Year":"1970-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"amc gremlin",
     "Miles_per_Gallon":21,
     "Cylinders":6,
     "Displacement":199,
     "Horsepower":90,
     "Weight_in_lbs":2648,
     "Acceleration":15,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford f250",
     "Miles_per_Gallon":10,
     "Cylinders":8,
     "Displacement":360,
     "Horsepower":215,
     "Weight_in_lbs":4615,
     "Acceleration":14,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevy c20",
     "Miles_per_Gallon":10,
     "Cylinders":8,
     "Displacement":307,
     "Horsepower":200,
     "Weight_in_lbs":4376,
     "Acceleration":15,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge d200",
     "Miles_per_Gallon":11,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":210,
     "Weight_in_lbs":4382,
     "Acceleration":13.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"hi 1200d",
     "Miles_per_Gallon":9,
     "Cylinders":8,
     "Displacement":304,
     "Horsepower":193,
     "Weight_in_lbs":4732,
     "Acceleration":18.5,
     "Year":"1970-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun pl510",
     "Miles_per_Gallon":27,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":88,
     "Weight_in_lbs":2130,
     "Acceleration":14.5,
     "Year":"1971-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"chevrolet vega 2300",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":90,
     "Weight_in_lbs":2264,
     "Acceleration":15.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota corona",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":113,
     "Horsepower":95,
     "Weight_in_lbs":2228,
     "Acceleration":14,
     "Year":"1971-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"ford pinto",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":null,
     "Weight_in_lbs":2046,
     "Acceleration":19,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volkswagen super beetle 117",
     "Miles_per_Gallon":null,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":48,
     "Weight_in_lbs":1978,
     "Acceleration":20,
     "Year":"1971-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"amc gremlin",
     "Miles_per_Gallon":19,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":100,
     "Weight_in_lbs":2634,
     "Acceleration":13,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth satellite custom",
     "Miles_per_Gallon":16,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":105,
     "Weight_in_lbs":3439,
     "Acceleration":15.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet chevelle malibu",
     "Miles_per_Gallon":17,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":100,
     "Weight_in_lbs":3329,
     "Acceleration":15.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford torino 500",
     "Miles_per_Gallon":19,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":88,
     "Weight_in_lbs":3302,
     "Acceleration":15.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc matador",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":100,
     "Weight_in_lbs":3288,
     "Acceleration":15.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet impala",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":165,
     "Weight_in_lbs":4209,
     "Acceleration":12,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac catalina brougham",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":175,
     "Weight_in_lbs":4464,
     "Acceleration":11.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford galaxie 500",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":351,
     "Horsepower":153,
     "Weight_in_lbs":4154,
     "Acceleration":13.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth fury iii",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":4096,
     "Acceleration":13,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge monaco (sw)",
     "Miles_per_Gallon":12,
     "Cylinders":8,
     "Displacement":383,
     "Horsepower":180,
     "Weight_in_lbs":4955,
     "Acceleration":11.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford country squire (sw)",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":170,
     "Weight_in_lbs":4746,
     "Acceleration":12,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac safari (sw)",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":175,
     "Weight_in_lbs":5140,
     "Acceleration":12,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc hornet sportabout (sw)",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":258,
     "Horsepower":110,
     "Weight_in_lbs":2962,
     "Acceleration":13.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet vega (sw)",
     "Miles_per_Gallon":22,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":72,
     "Weight_in_lbs":2408,
     "Acceleration":19,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac firebird",
     "Miles_per_Gallon":19,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":100,
     "Weight_in_lbs":3282,
     "Acceleration":15,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford mustang",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":88,
     "Weight_in_lbs":3139,
     "Acceleration":14.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury capri 2000",
     "Miles_per_Gallon":23,
     "Cylinders":4,
     "Displacement":122,
     "Horsepower":86,
     "Weight_in_lbs":2220,
     "Acceleration":14,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"opel 1900",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":116,
     "Horsepower":90,
     "Weight_in_lbs":2123,
     "Acceleration":14,
     "Year":"1971-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"peugeot 304",
     "Miles_per_Gallon":30,
     "Cylinders":4,
     "Displacement":79,
     "Horsepower":70,
     "Weight_in_lbs":2074,
     "Acceleration":19.5,
     "Year":"1971-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"fiat 124b",
     "Miles_per_Gallon":30,
     "Cylinders":4,
     "Displacement":88,
     "Horsepower":76,
     "Weight_in_lbs":2065,
     "Acceleration":14.5,
     "Year":"1971-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"toyota corolla 1200",
     "Miles_per_Gallon":31,
     "Cylinders":4,
     "Displacement":71,
     "Horsepower":65,
     "Weight_in_lbs":1773,
     "Acceleration":19,
     "Year":"1971-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"datsun 1200",
     "Miles_per_Gallon":35,
     "Cylinders":4,
     "Displacement":72,
     "Horsepower":69,
     "Weight_in_lbs":1613,
     "Acceleration":18,
     "Year":"1971-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"volkswagen model 111",
     "Miles_per_Gallon":27,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":60,
     "Weight_in_lbs":1834,
     "Acceleration":19,
     "Year":"1971-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"plymouth cricket",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":70,
     "Weight_in_lbs":1955,
     "Acceleration":20.5,
     "Year":"1971-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota corona hardtop",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":113,
     "Horsepower":95,
     "Weight_in_lbs":2278,
     "Acceleration":15.5,
     "Year":"1972-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"dodge colt hardtop",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":97.5,
     "Horsepower":80,
     "Weight_in_lbs":2126,
     "Acceleration":17,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volkswagen type 3",
     "Miles_per_Gallon":23,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":54,
     "Weight_in_lbs":2254,
     "Acceleration":23.5,
     "Year":"1972-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"chevrolet vega",
     "Miles_per_Gallon":20,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":90,
     "Weight_in_lbs":2408,
     "Acceleration":19.5,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford pinto runabout",
     "Miles_per_Gallon":21,
     "Cylinders":4,
     "Displacement":122,
     "Horsepower":86,
     "Weight_in_lbs":2226,
     "Acceleration":16.5,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet impala",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":165,
     "Weight_in_lbs":4274,
     "Acceleration":12,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac catalina",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":175,
     "Weight_in_lbs":4385,
     "Acceleration":12,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth fury iii",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":4135,
     "Acceleration":13.5,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford galaxie 500",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":351,
     "Horsepower":153,
     "Weight_in_lbs":4129,
     "Acceleration":13,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc ambassador sst",
     "Miles_per_Gallon":17,
     "Cylinders":8,
     "Displacement":304,
     "Horsepower":150,
     "Weight_in_lbs":3672,
     "Acceleration":11.5,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury marquis",
     "Miles_per_Gallon":11,
     "Cylinders":8,
     "Displacement":429,
     "Horsepower":208,
     "Weight_in_lbs":4633,
     "Acceleration":11,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick lesabre custom",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":155,
     "Weight_in_lbs":4502,
     "Acceleration":13.5,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"oldsmobile delta 88 royale",
     "Miles_per_Gallon":12,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":160,
     "Weight_in_lbs":4456,
     "Acceleration":13.5,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chrysler newport royal",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":190,
     "Weight_in_lbs":4422,
     "Acceleration":12.5,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mazda rx2 coupe",
     "Miles_per_Gallon":19,
     "Cylinders":3,
     "Displacement":70,
     "Horsepower":97,
     "Weight_in_lbs":2330,
     "Acceleration":13.5,
     "Year":"1972-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"amc matador (sw)",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":304,
     "Horsepower":150,
     "Weight_in_lbs":3892,
     "Acceleration":12.5,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet chevelle concours (sw)",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":307,
     "Horsepower":130,
     "Weight_in_lbs":4098,
     "Acceleration":14,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford gran torino (sw)",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":140,
     "Weight_in_lbs":4294,
     "Acceleration":16,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth satellite custom (sw)",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":4077,
     "Acceleration":14,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volvo 145e (sw)",
     "Miles_per_Gallon":18,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":112,
     "Weight_in_lbs":2933,
     "Acceleration":14.5,
     "Year":"1972-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"volkswagen 411 (sw)",
     "Miles_per_Gallon":22,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":76,
     "Weight_in_lbs":2511,
     "Acceleration":18,
     "Year":"1972-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"peugeot 504 (sw)",
     "Miles_per_Gallon":21,
     "Cylinders":4,
     "Displacement":120,
     "Horsepower":87,
     "Weight_in_lbs":2979,
     "Acceleration":19.5,
     "Year":"1972-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"renault 12 (sw)",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":96,
     "Horsepower":69,
     "Weight_in_lbs":2189,
     "Acceleration":18,
     "Year":"1972-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"ford pinto (sw)",
     "Miles_per_Gallon":22,
     "Cylinders":4,
     "Displacement":122,
     "Horsepower":86,
     "Weight_in_lbs":2395,
     "Acceleration":16,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun 510 (sw)",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":92,
     "Weight_in_lbs":2288,
     "Acceleration":17,
     "Year":"1972-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"toyouta corona mark ii (sw)",
     "Miles_per_Gallon":23,
     "Cylinders":4,
     "Displacement":120,
     "Horsepower":97,
     "Weight_in_lbs":2506,
     "Acceleration":14.5,
     "Year":"1972-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"dodge colt (sw)",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":80,
     "Weight_in_lbs":2164,
     "Acceleration":15,
     "Year":"1972-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota corolla 1600 (sw)",
     "Miles_per_Gallon":27,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":88,
     "Weight_in_lbs":2100,
     "Acceleration":16.5,
     "Year":"1972-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"buick century 350",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":175,
     "Weight_in_lbs":4100,
     "Acceleration":13,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc matador",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":304,
     "Horsepower":150,
     "Weight_in_lbs":3672,
     "Acceleration":11.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet malibu",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":145,
     "Weight_in_lbs":3988,
     "Acceleration":13,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford gran torino",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":137,
     "Weight_in_lbs":4042,
     "Acceleration":14.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge coronet custom",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":3777,
     "Acceleration":12.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury marquis brougham",
     "Miles_per_Gallon":12,
     "Cylinders":8,
     "Displacement":429,
     "Horsepower":198,
     "Weight_in_lbs":4952,
     "Acceleration":11.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet caprice classic",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":150,
     "Weight_in_lbs":4464,
     "Acceleration":12,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford ltd",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":351,
     "Horsepower":158,
     "Weight_in_lbs":4363,
     "Acceleration":13,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth fury gran sedan",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":4237,
     "Acceleration":14.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chrysler new yorker brougham",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":440,
     "Horsepower":215,
     "Weight_in_lbs":4735,
     "Acceleration":11,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick electra 225 custom",
     "Miles_per_Gallon":12,
     "Cylinders":8,
     "Displacement":455,
     "Horsepower":225,
     "Weight_in_lbs":4951,
     "Acceleration":11,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc ambassador brougham",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":360,
     "Horsepower":175,
     "Weight_in_lbs":3821,
     "Acceleration":11,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth valiant",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":105,
     "Weight_in_lbs":3121,
     "Acceleration":16.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet nova custom",
     "Miles_per_Gallon":16,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":100,
     "Weight_in_lbs":3278,
     "Acceleration":18,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc hornet",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":100,
     "Weight_in_lbs":2945,
     "Acceleration":16,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford maverick",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":88,
     "Weight_in_lbs":3021,
     "Acceleration":16.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth duster",
     "Miles_per_Gallon":23,
     "Cylinders":6,
     "Displacement":198,
     "Horsepower":95,
     "Weight_in_lbs":2904,
     "Acceleration":16,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volkswagen super beetle",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":46,
     "Weight_in_lbs":1950,
     "Acceleration":21,
     "Year":"1973-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"chevrolet impala",
     "Miles_per_Gallon":11,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":150,
     "Weight_in_lbs":4997,
     "Acceleration":14,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford country",
     "Miles_per_Gallon":12,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":167,
     "Weight_in_lbs":4906,
     "Acceleration":12.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth custom suburb",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":360,
     "Horsepower":170,
     "Weight_in_lbs":4654,
     "Acceleration":13,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"oldsmobile vista cruiser",
     "Miles_per_Gallon":12,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":180,
     "Weight_in_lbs":4499,
     "Acceleration":12.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc gremlin",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":100,
     "Weight_in_lbs":2789,
     "Acceleration":15,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota carina",
     "Miles_per_Gallon":20,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":88,
     "Weight_in_lbs":2279,
     "Acceleration":19,
     "Year":"1973-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"chevrolet vega",
     "Miles_per_Gallon":21,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":72,
     "Weight_in_lbs":2401,
     "Acceleration":19.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun 610",
     "Miles_per_Gallon":22,
     "Cylinders":4,
     "Displacement":108,
     "Horsepower":94,
     "Weight_in_lbs":2379,
     "Acceleration":16.5,
     "Year":"1973-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"maxda rx3",
     "Miles_per_Gallon":18,
     "Cylinders":3,
     "Displacement":70,
     "Horsepower":90,
     "Weight_in_lbs":2124,
     "Acceleration":13.5,
     "Year":"1973-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"ford pinto",
     "Miles_per_Gallon":19,
     "Cylinders":4,
     "Displacement":122,
     "Horsepower":85,
     "Weight_in_lbs":2310,
     "Acceleration":18.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury capri v6",
     "Miles_per_Gallon":21,
     "Cylinders":6,
     "Displacement":155,
     "Horsepower":107,
     "Weight_in_lbs":2472,
     "Acceleration":14,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"fiat 124 sport coupe",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":90,
     "Weight_in_lbs":2265,
     "Acceleration":15.5,
     "Year":"1973-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"chevrolet monte carlo s",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":145,
     "Weight_in_lbs":4082,
     "Acceleration":13,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac grand prix",
     "Miles_per_Gallon":16,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":230,
     "Weight_in_lbs":4278,
     "Acceleration":9.5,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"fiat 128",
     "Miles_per_Gallon":29,
     "Cylinders":4,
     "Displacement":68,
     "Horsepower":49,
     "Weight_in_lbs":1867,
     "Acceleration":19.5,
     "Year":"1973-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"opel manta",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":116,
     "Horsepower":75,
     "Weight_in_lbs":2158,
     "Acceleration":15.5,
     "Year":"1973-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"audi 100ls",
     "Miles_per_Gallon":20,
     "Cylinders":4,
     "Displacement":114,
     "Horsepower":91,
     "Weight_in_lbs":2582,
     "Acceleration":14,
     "Year":"1973-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"volvo 144ea",
     "Miles_per_Gallon":19,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":112,
     "Weight_in_lbs":2868,
     "Acceleration":15.5,
     "Year":"1973-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"dodge dart custom",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":3399,
     "Acceleration":11,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"saab 99le",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":110,
     "Weight_in_lbs":2660,
     "Acceleration":14,
     "Year":"1973-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"toyota mark ii",
     "Miles_per_Gallon":20,
     "Cylinders":6,
     "Displacement":156,
     "Horsepower":122,
     "Weight_in_lbs":2807,
     "Acceleration":13.5,
     "Year":"1973-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"oldsmobile omega",
     "Miles_per_Gallon":11,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":180,
     "Weight_in_lbs":3664,
     "Acceleration":11,
     "Year":"1973-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth duster",
     "Miles_per_Gallon":20,
     "Cylinders":6,
     "Displacement":198,
     "Horsepower":95,
     "Weight_in_lbs":3102,
     "Acceleration":16.5,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford maverick",
     "Miles_per_Gallon":21,
     "Cylinders":6,
     "Displacement":200,
     "Horsepower":null,
     "Weight_in_lbs":2875,
     "Acceleration":17,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc hornet",
     "Miles_per_Gallon":19,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":100,
     "Weight_in_lbs":2901,
     "Acceleration":16,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet nova",
     "Miles_per_Gallon":15,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":100,
     "Weight_in_lbs":3336,
     "Acceleration":17,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun b210",
     "Miles_per_Gallon":31,
     "Cylinders":4,
     "Displacement":79,
     "Horsepower":67,
     "Weight_in_lbs":1950,
     "Acceleration":19,
     "Year":"1974-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"ford pinto",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":122,
     "Horsepower":80,
     "Weight_in_lbs":2451,
     "Acceleration":16.5,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota corolla 1200",
     "Miles_per_Gallon":32,
     "Cylinders":4,
     "Displacement":71,
     "Horsepower":65,
     "Weight_in_lbs":1836,
     "Acceleration":21,
     "Year":"1974-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"chevrolet vega",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":75,
     "Weight_in_lbs":2542,
     "Acceleration":17,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet chevelle malibu classic",
     "Miles_per_Gallon":16,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":100,
     "Weight_in_lbs":3781,
     "Acceleration":17,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc matador",
     "Miles_per_Gallon":16,
     "Cylinders":6,
     "Displacement":258,
     "Horsepower":110,
     "Weight_in_lbs":3632,
     "Acceleration":18,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth satellite sebring",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":105,
     "Weight_in_lbs":3613,
     "Acceleration":16.5,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford gran torino",
     "Miles_per_Gallon":16,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":140,
     "Weight_in_lbs":4141,
     "Acceleration":14,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick century luxus (sw)",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":150,
     "Weight_in_lbs":4699,
     "Acceleration":14.5,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge coronet custom (sw)",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":4457,
     "Acceleration":13.5,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford gran torino (sw)",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":140,
     "Weight_in_lbs":4638,
     "Acceleration":16,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc matador (sw)",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":304,
     "Horsepower":150,
     "Weight_in_lbs":4257,
     "Acceleration":15.5,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"audi fox",
     "Miles_per_Gallon":29,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":83,
     "Weight_in_lbs":2219,
     "Acceleration":16.5,
     "Year":"1974-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"volkswagen dasher",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":79,
     "Horsepower":67,
     "Weight_in_lbs":1963,
     "Acceleration":15.5,
     "Year":"1974-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"opel manta",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":78,
     "Weight_in_lbs":2300,
     "Acceleration":14.5,
     "Year":"1974-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"toyota corona",
     "Miles_per_Gallon":31,
     "Cylinders":4,
     "Displacement":76,
     "Horsepower":52,
     "Weight_in_lbs":1649,
     "Acceleration":16.5,
     "Year":"1974-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"datsun 710",
     "Miles_per_Gallon":32,
     "Cylinders":4,
     "Displacement":83,
     "Horsepower":61,
     "Weight_in_lbs":2003,
     "Acceleration":19,
     "Year":"1974-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"dodge colt",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":90,
     "Horsepower":75,
     "Weight_in_lbs":2125,
     "Acceleration":14.5,
     "Year":"1974-01-01",
     "Origin":"USA"
  },
  {
     "Name":"fiat 128",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":90,
     "Horsepower":75,
     "Weight_in_lbs":2108,
     "Acceleration":15.5,
     "Year":"1974-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"fiat 124 tc",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":116,
     "Horsepower":75,
     "Weight_in_lbs":2246,
     "Acceleration":14,
     "Year":"1974-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"honda civic",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":120,
     "Horsepower":97,
     "Weight_in_lbs":2489,
     "Acceleration":15,
     "Year":"1974-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"subaru",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":108,
     "Horsepower":93,
     "Weight_in_lbs":2391,
     "Acceleration":15.5,
     "Year":"1974-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"fiat x1.9",
     "Miles_per_Gallon":31,
     "Cylinders":4,
     "Displacement":79,
     "Horsepower":67,
     "Weight_in_lbs":2000,
     "Acceleration":16,
     "Year":"1974-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"plymouth valiant custom",
     "Miles_per_Gallon":19,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":95,
     "Weight_in_lbs":3264,
     "Acceleration":16,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet nova",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":105,
     "Weight_in_lbs":3459,
     "Acceleration":16,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury monarch",
     "Miles_per_Gallon":15,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":72,
     "Weight_in_lbs":3432,
     "Acceleration":21,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford maverick",
     "Miles_per_Gallon":15,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":72,
     "Weight_in_lbs":3158,
     "Acceleration":19.5,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac catalina",
     "Miles_per_Gallon":16,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":170,
     "Weight_in_lbs":4668,
     "Acceleration":11.5,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet bel air",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":145,
     "Weight_in_lbs":4440,
     "Acceleration":14,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth grand fury",
     "Miles_per_Gallon":16,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":4498,
     "Acceleration":14.5,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford ltd",
     "Miles_per_Gallon":14,
     "Cylinders":8,
     "Displacement":351,
     "Horsepower":148,
     "Weight_in_lbs":4657,
     "Acceleration":13.5,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick century",
     "Miles_per_Gallon":17,
     "Cylinders":6,
     "Displacement":231,
     "Horsepower":110,
     "Weight_in_lbs":3907,
     "Acceleration":21,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevroelt chevelle malibu",
     "Miles_per_Gallon":16,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":105,
     "Weight_in_lbs":3897,
     "Acceleration":18.5,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc matador",
     "Miles_per_Gallon":15,
     "Cylinders":6,
     "Displacement":258,
     "Horsepower":110,
     "Weight_in_lbs":3730,
     "Acceleration":19,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth fury",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":95,
     "Weight_in_lbs":3785,
     "Acceleration":19,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick skyhawk",
     "Miles_per_Gallon":21,
     "Cylinders":6,
     "Displacement":231,
     "Horsepower":110,
     "Weight_in_lbs":3039,
     "Acceleration":15,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet monza 2+2",
     "Miles_per_Gallon":20,
     "Cylinders":8,
     "Displacement":262,
     "Horsepower":110,
     "Weight_in_lbs":3221,
     "Acceleration":13.5,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford mustang ii",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":129,
     "Weight_in_lbs":3169,
     "Acceleration":12,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota corolla",
     "Miles_per_Gallon":29,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":75,
     "Weight_in_lbs":2171,
     "Acceleration":16,
     "Year":"1975-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"ford pinto",
     "Miles_per_Gallon":23,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":83,
     "Weight_in_lbs":2639,
     "Acceleration":17,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc gremlin",
     "Miles_per_Gallon":20,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":100,
     "Weight_in_lbs":2914,
     "Acceleration":16,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac astro",
     "Miles_per_Gallon":23,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":78,
     "Weight_in_lbs":2592,
     "Acceleration":18.5,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota corona",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":134,
     "Horsepower":96,
     "Weight_in_lbs":2702,
     "Acceleration":13.5,
     "Year":"1975-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"volkswagen dasher",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":90,
     "Horsepower":71,
     "Weight_in_lbs":2223,
     "Acceleration":16.5,
     "Year":"1975-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"datsun 710",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":119,
     "Horsepower":97,
     "Weight_in_lbs":2545,
     "Acceleration":17,
     "Year":"1975-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"ford pinto",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":171,
     "Horsepower":97,
     "Weight_in_lbs":2984,
     "Acceleration":14.5,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volkswagen rabbit",
     "Miles_per_Gallon":29,
     "Cylinders":4,
     "Displacement":90,
     "Horsepower":70,
     "Weight_in_lbs":1937,
     "Acceleration":14,
     "Year":"1975-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"amc pacer",
     "Miles_per_Gallon":19,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":90,
     "Weight_in_lbs":3211,
     "Acceleration":17,
     "Year":"1975-01-01",
     "Origin":"USA"
  },
  {
     "Name":"audi 100ls",
     "Miles_per_Gallon":23,
     "Cylinders":4,
     "Displacement":115,
     "Horsepower":95,
     "Weight_in_lbs":2694,
     "Acceleration":15,
     "Year":"1975-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"peugeot 504",
     "Miles_per_Gallon":23,
     "Cylinders":4,
     "Displacement":120,
     "Horsepower":88,
     "Weight_in_lbs":2957,
     "Acceleration":17,
     "Year":"1975-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"volvo 244dl",
     "Miles_per_Gallon":22,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":98,
     "Weight_in_lbs":2945,
     "Acceleration":14.5,
     "Year":"1975-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"saab 99le",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":115,
     "Weight_in_lbs":2671,
     "Acceleration":13.5,
     "Year":"1975-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"honda civic cvcc",
     "Miles_per_Gallon":33,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":53,
     "Weight_in_lbs":1795,
     "Acceleration":17.5,
     "Year":"1975-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"fiat 131",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":107,
     "Horsepower":86,
     "Weight_in_lbs":2464,
     "Acceleration":15.5,
     "Year":"1976-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"opel 1900",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":116,
     "Horsepower":81,
     "Weight_in_lbs":2220,
     "Acceleration":16.9,
     "Year":"1976-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"capri ii",
     "Miles_per_Gallon":25,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":92,
     "Weight_in_lbs":2572,
     "Acceleration":14.9,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge colt",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":79,
     "Weight_in_lbs":2255,
     "Acceleration":17.7,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"renault 12tl",
     "Miles_per_Gallon":27,
     "Cylinders":4,
     "Displacement":101,
     "Horsepower":83,
     "Weight_in_lbs":2202,
     "Acceleration":15.3,
     "Year":"1976-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"chevrolet chevelle malibu classic",
     "Miles_per_Gallon":17.5,
     "Cylinders":8,
     "Displacement":305,
     "Horsepower":140,
     "Weight_in_lbs":4215,
     "Acceleration":13,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge coronet brougham",
     "Miles_per_Gallon":16,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":4190,
     "Acceleration":13,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc matador",
     "Miles_per_Gallon":15.5,
     "Cylinders":8,
     "Displacement":304,
     "Horsepower":120,
     "Weight_in_lbs":3962,
     "Acceleration":13.9,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford gran torino",
     "Miles_per_Gallon":14.5,
     "Cylinders":8,
     "Displacement":351,
     "Horsepower":152,
     "Weight_in_lbs":4215,
     "Acceleration":12.8,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth valiant",
     "Miles_per_Gallon":22,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":100,
     "Weight_in_lbs":3233,
     "Acceleration":15.4,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet nova",
     "Miles_per_Gallon":22,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":105,
     "Weight_in_lbs":3353,
     "Acceleration":14.5,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford maverick",
     "Miles_per_Gallon":24,
     "Cylinders":6,
     "Displacement":200,
     "Horsepower":81,
     "Weight_in_lbs":3012,
     "Acceleration":17.6,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc hornet",
     "Miles_per_Gallon":22.5,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":90,
     "Weight_in_lbs":3085,
     "Acceleration":17.6,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet chevette",
     "Miles_per_Gallon":29,
     "Cylinders":4,
     "Displacement":85,
     "Horsepower":52,
     "Weight_in_lbs":2035,
     "Acceleration":22.2,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet woody",
     "Miles_per_Gallon":24.5,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":60,
     "Weight_in_lbs":2164,
     "Acceleration":22.1,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"vw rabbit",
     "Miles_per_Gallon":29,
     "Cylinders":4,
     "Displacement":90,
     "Horsepower":70,
     "Weight_in_lbs":1937,
     "Acceleration":14.2,
     "Year":"1976-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"honda civic",
     "Miles_per_Gallon":33,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":53,
     "Weight_in_lbs":1795,
     "Acceleration":17.4,
     "Year":"1976-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"dodge aspen se",
     "Miles_per_Gallon":20,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":100,
     "Weight_in_lbs":3651,
     "Acceleration":17.7,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford granada ghia",
     "Miles_per_Gallon":18,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":78,
     "Weight_in_lbs":3574,
     "Acceleration":21,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac ventura sj",
     "Miles_per_Gallon":18.5,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":110,
     "Weight_in_lbs":3645,
     "Acceleration":16.2,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc pacer d/l",
     "Miles_per_Gallon":17.5,
     "Cylinders":6,
     "Displacement":258,
     "Horsepower":95,
     "Weight_in_lbs":3193,
     "Acceleration":17.8,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volkswagen rabbit",
     "Miles_per_Gallon":29.5,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":71,
     "Weight_in_lbs":1825,
     "Acceleration":12.2,
     "Year":"1976-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"datsun b-210",
     "Miles_per_Gallon":32,
     "Cylinders":4,
     "Displacement":85,
     "Horsepower":70,
     "Weight_in_lbs":1990,
     "Acceleration":17,
     "Year":"1976-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"toyota corolla",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":75,
     "Weight_in_lbs":2155,
     "Acceleration":16.4,
     "Year":"1976-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"ford pinto",
     "Miles_per_Gallon":26.5,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":72,
     "Weight_in_lbs":2565,
     "Acceleration":13.6,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volvo 245",
     "Miles_per_Gallon":20,
     "Cylinders":4,
     "Displacement":130,
     "Horsepower":102,
     "Weight_in_lbs":3150,
     "Acceleration":15.7,
     "Year":"1976-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"plymouth volare premier v8",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":3940,
     "Acceleration":13.2,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"peugeot 504",
     "Miles_per_Gallon":19,
     "Cylinders":4,
     "Displacement":120,
     "Horsepower":88,
     "Weight_in_lbs":3270,
     "Acceleration":21.9,
     "Year":"1976-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"toyota mark ii",
     "Miles_per_Gallon":19,
     "Cylinders":6,
     "Displacement":156,
     "Horsepower":108,
     "Weight_in_lbs":2930,
     "Acceleration":15.5,
     "Year":"1976-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"mercedes-benz 280s",
     "Miles_per_Gallon":16.5,
     "Cylinders":6,
     "Displacement":168,
     "Horsepower":120,
     "Weight_in_lbs":3820,
     "Acceleration":16.7,
     "Year":"1976-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"cadillac seville",
     "Miles_per_Gallon":16.5,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":180,
     "Weight_in_lbs":4380,
     "Acceleration":12.1,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevy c10",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":145,
     "Weight_in_lbs":4055,
     "Acceleration":12,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford f108",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":130,
     "Weight_in_lbs":3870,
     "Acceleration":15,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge d100",
     "Miles_per_Gallon":13,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":150,
     "Weight_in_lbs":3755,
     "Acceleration":14,
     "Year":"1976-01-01",
     "Origin":"USA"
  },
  {
     "Name":"honda Accelerationord cvcc",
     "Miles_per_Gallon":31.5,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":68,
     "Weight_in_lbs":2045,
     "Acceleration":18.5,
     "Year":"1977-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"buick opel isuzu deluxe",
     "Miles_per_Gallon":30,
     "Cylinders":4,
     "Displacement":111,
     "Horsepower":80,
     "Weight_in_lbs":2155,
     "Acceleration":14.8,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"renault 5 gtl",
     "Miles_per_Gallon":36,
     "Cylinders":4,
     "Displacement":79,
     "Horsepower":58,
     "Weight_in_lbs":1825,
     "Acceleration":18.6,
     "Year":"1977-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"plymouth arrow gs",
     "Miles_per_Gallon":25.5,
     "Cylinders":4,
     "Displacement":122,
     "Horsepower":96,
     "Weight_in_lbs":2300,
     "Acceleration":15.5,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun f-10 hatchback",
     "Miles_per_Gallon":33.5,
     "Cylinders":4,
     "Displacement":85,
     "Horsepower":70,
     "Weight_in_lbs":1945,
     "Acceleration":16.8,
     "Year":"1977-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"chevrolet caprice classic",
     "Miles_per_Gallon":17.5,
     "Cylinders":8,
     "Displacement":305,
     "Horsepower":145,
     "Weight_in_lbs":3880,
     "Acceleration":12.5,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"oldsmobile cutlass supreme",
     "Miles_per_Gallon":17,
     "Cylinders":8,
     "Displacement":260,
     "Horsepower":110,
     "Weight_in_lbs":4060,
     "Acceleration":19,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge monaco brougham",
     "Miles_per_Gallon":15.5,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":145,
     "Weight_in_lbs":4140,
     "Acceleration":13.7,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury cougar brougham",
     "Miles_per_Gallon":15,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":130,
     "Weight_in_lbs":4295,
     "Acceleration":14.9,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet concours",
     "Miles_per_Gallon":17.5,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":110,
     "Weight_in_lbs":3520,
     "Acceleration":16.4,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick skylark",
     "Miles_per_Gallon":20.5,
     "Cylinders":6,
     "Displacement":231,
     "Horsepower":105,
     "Weight_in_lbs":3425,
     "Acceleration":16.9,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth volare custom",
     "Miles_per_Gallon":19,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":100,
     "Weight_in_lbs":3630,
     "Acceleration":17.7,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford granada",
     "Miles_per_Gallon":18.5,
     "Cylinders":6,
     "Displacement":250,
     "Horsepower":98,
     "Weight_in_lbs":3525,
     "Acceleration":19,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac grand prix lj",
     "Miles_per_Gallon":16,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":180,
     "Weight_in_lbs":4220,
     "Acceleration":11.1,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet monte carlo landau",
     "Miles_per_Gallon":15.5,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":170,
     "Weight_in_lbs":4165,
     "Acceleration":11.4,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chrysler cordoba",
     "Miles_per_Gallon":15.5,
     "Cylinders":8,
     "Displacement":400,
     "Horsepower":190,
     "Weight_in_lbs":4325,
     "Acceleration":12.2,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford thunderbird",
     "Miles_per_Gallon":16,
     "Cylinders":8,
     "Displacement":351,
     "Horsepower":149,
     "Weight_in_lbs":4335,
     "Acceleration":14.5,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volkswagen rabbit custom",
     "Miles_per_Gallon":29,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":78,
     "Weight_in_lbs":1940,
     "Acceleration":14.5,
     "Year":"1977-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"pontiac sunbird coupe",
     "Miles_per_Gallon":24.5,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":88,
     "Weight_in_lbs":2740,
     "Acceleration":16,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota corolla liftback",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":75,
     "Weight_in_lbs":2265,
     "Acceleration":18.2,
     "Year":"1977-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"ford mustang ii 2+2",
     "Miles_per_Gallon":25.5,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":89,
     "Weight_in_lbs":2755,
     "Acceleration":15.8,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet chevette",
     "Miles_per_Gallon":30.5,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":63,
     "Weight_in_lbs":2051,
     "Acceleration":17,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge colt m/m",
     "Miles_per_Gallon":33.5,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":83,
     "Weight_in_lbs":2075,
     "Acceleration":15.9,
     "Year":"1977-01-01",
     "Origin":"USA"
  },
  {
     "Name":"subaru dl",
     "Miles_per_Gallon":30,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":67,
     "Weight_in_lbs":1985,
     "Acceleration":16.4,
     "Year":"1977-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"volkswagen dasher",
     "Miles_per_Gallon":30.5,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":78,
     "Weight_in_lbs":2190,
     "Acceleration":14.1,
     "Year":"1977-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"datsun 810",
     "Miles_per_Gallon":22,
     "Cylinders":6,
     "Displacement":146,
     "Horsepower":97,
     "Weight_in_lbs":2815,
     "Acceleration":14.5,
     "Year":"1977-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"bmw 320i",
     "Miles_per_Gallon":21.5,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":110,
     "Weight_in_lbs":2600,
     "Acceleration":12.8,
     "Year":"1977-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"mazda rx-4",
     "Miles_per_Gallon":21.5,
     "Cylinders":3,
     "Displacement":80,
     "Horsepower":110,
     "Weight_in_lbs":2720,
     "Acceleration":13.5,
     "Year":"1977-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"volkswagen rabbit custom diesel",
     "Miles_per_Gallon":43.1,
     "Cylinders":4,
     "Displacement":90,
     "Horsepower":48,
     "Weight_in_lbs":1985,
     "Acceleration":21.5,
     "Year":"1978-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"ford fiesta",
     "Miles_per_Gallon":36.1,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":66,
     "Weight_in_lbs":1800,
     "Acceleration":14.4,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mazda glc deluxe",
     "Miles_per_Gallon":32.8,
     "Cylinders":4,
     "Displacement":78,
     "Horsepower":52,
     "Weight_in_lbs":1985,
     "Acceleration":19.4,
     "Year":"1978-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"datsun b210 gx",
     "Miles_per_Gallon":39.4,
     "Cylinders":4,
     "Displacement":85,
     "Horsepower":70,
     "Weight_in_lbs":2070,
     "Acceleration":18.6,
     "Year":"1978-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"honda civic cvcc",
     "Miles_per_Gallon":36.1,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":60,
     "Weight_in_lbs":1800,
     "Acceleration":16.4,
     "Year":"1978-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"oldsmobile cutlass salon brougham",
     "Miles_per_Gallon":19.9,
     "Cylinders":8,
     "Displacement":260,
     "Horsepower":110,
     "Weight_in_lbs":3365,
     "Acceleration":15.5,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge diplomat",
     "Miles_per_Gallon":19.4,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":140,
     "Weight_in_lbs":3735,
     "Acceleration":13.2,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury monarch ghia",
     "Miles_per_Gallon":20.2,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":139,
     "Weight_in_lbs":3570,
     "Acceleration":12.8,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac phoenix lj",
     "Miles_per_Gallon":19.2,
     "Cylinders":6,
     "Displacement":231,
     "Horsepower":105,
     "Weight_in_lbs":3535,
     "Acceleration":19.2,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet malibu",
     "Miles_per_Gallon":20.5,
     "Cylinders":6,
     "Displacement":200,
     "Horsepower":95,
     "Weight_in_lbs":3155,
     "Acceleration":18.2,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford fairmont (auto)",
     "Miles_per_Gallon":20.2,
     "Cylinders":6,
     "Displacement":200,
     "Horsepower":85,
     "Weight_in_lbs":2965,
     "Acceleration":15.8,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford fairmont (man)",
     "Miles_per_Gallon":25.1,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":88,
     "Weight_in_lbs":2720,
     "Acceleration":15.4,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth volare",
     "Miles_per_Gallon":20.5,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":100,
     "Weight_in_lbs":3430,
     "Acceleration":17.2,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc concord",
     "Miles_per_Gallon":19.4,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":90,
     "Weight_in_lbs":3210,
     "Acceleration":17.2,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick century special",
     "Miles_per_Gallon":20.6,
     "Cylinders":6,
     "Displacement":231,
     "Horsepower":105,
     "Weight_in_lbs":3380,
     "Acceleration":15.8,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury zephyr",
     "Miles_per_Gallon":20.8,
     "Cylinders":6,
     "Displacement":200,
     "Horsepower":85,
     "Weight_in_lbs":3070,
     "Acceleration":16.7,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge aspen",
     "Miles_per_Gallon":18.6,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":110,
     "Weight_in_lbs":3620,
     "Acceleration":18.7,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc concord d/l",
     "Miles_per_Gallon":18.1,
     "Cylinders":6,
     "Displacement":258,
     "Horsepower":120,
     "Weight_in_lbs":3410,
     "Acceleration":15.1,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet monte carlo landau",
     "Miles_per_Gallon":19.2,
     "Cylinders":8,
     "Displacement":305,
     "Horsepower":145,
     "Weight_in_lbs":3425,
     "Acceleration":13.2,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick regal sport coupe (turbo)",
     "Miles_per_Gallon":17.7,
     "Cylinders":6,
     "Displacement":231,
     "Horsepower":165,
     "Weight_in_lbs":3445,
     "Acceleration":13.4,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford futura",
     "Miles_per_Gallon":18.1,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":139,
     "Weight_in_lbs":3205,
     "Acceleration":11.2,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge magnum xe",
     "Miles_per_Gallon":17.5,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":140,
     "Weight_in_lbs":4080,
     "Acceleration":13.7,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet chevette",
     "Miles_per_Gallon":30,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":68,
     "Weight_in_lbs":2155,
     "Acceleration":16.5,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota corona",
     "Miles_per_Gallon":27.5,
     "Cylinders":4,
     "Displacement":134,
     "Horsepower":95,
     "Weight_in_lbs":2560,
     "Acceleration":14.2,
     "Year":"1978-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"datsun 510",
     "Miles_per_Gallon":27.2,
     "Cylinders":4,
     "Displacement":119,
     "Horsepower":97,
     "Weight_in_lbs":2300,
     "Acceleration":14.7,
     "Year":"1978-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"dodge omni",
     "Miles_per_Gallon":30.9,
     "Cylinders":4,
     "Displacement":105,
     "Horsepower":75,
     "Weight_in_lbs":2230,
     "Acceleration":14.5,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota celica gt liftback",
     "Miles_per_Gallon":21.1,
     "Cylinders":4,
     "Displacement":134,
     "Horsepower":95,
     "Weight_in_lbs":2515,
     "Acceleration":14.8,
     "Year":"1978-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"plymouth sapporo",
     "Miles_per_Gallon":23.2,
     "Cylinders":4,
     "Displacement":156,
     "Horsepower":105,
     "Weight_in_lbs":2745,
     "Acceleration":16.7,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"oldsmobile starfire sx",
     "Miles_per_Gallon":23.8,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":85,
     "Weight_in_lbs":2855,
     "Acceleration":17.6,
     "Year":"1978-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun 200-sx",
     "Miles_per_Gallon":23.9,
     "Cylinders":4,
     "Displacement":119,
     "Horsepower":97,
     "Weight_in_lbs":2405,
     "Acceleration":14.9,
     "Year":"1978-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"audi 5000",
     "Miles_per_Gallon":20.3,
     "Cylinders":5,
     "Displacement":131,
     "Horsepower":103,
     "Weight_in_lbs":2830,
     "Acceleration":15.9,
     "Year":"1978-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"volvo 264gl",
     "Miles_per_Gallon":17,
     "Cylinders":6,
     "Displacement":163,
     "Horsepower":125,
     "Weight_in_lbs":3140,
     "Acceleration":13.6,
     "Year":"1978-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"saab 99gle",
     "Miles_per_Gallon":21.6,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":115,
     "Weight_in_lbs":2795,
     "Acceleration":15.7,
     "Year":"1978-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"peugeot 604sl",
     "Miles_per_Gallon":16.2,
     "Cylinders":6,
     "Displacement":163,
     "Horsepower":133,
     "Weight_in_lbs":3410,
     "Acceleration":15.8,
     "Year":"1978-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"volkswagen scirocco",
     "Miles_per_Gallon":31.5,
     "Cylinders":4,
     "Displacement":89,
     "Horsepower":71,
     "Weight_in_lbs":1990,
     "Acceleration":14.9,
     "Year":"1978-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"honda Accelerationord lx",
     "Miles_per_Gallon":29.5,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":68,
     "Weight_in_lbs":2135,
     "Acceleration":16.6,
     "Year":"1978-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"pontiac lemans v6",
     "Miles_per_Gallon":21.5,
     "Cylinders":6,
     "Displacement":231,
     "Horsepower":115,
     "Weight_in_lbs":3245,
     "Acceleration":15.4,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury zephyr 6",
     "Miles_per_Gallon":19.8,
     "Cylinders":6,
     "Displacement":200,
     "Horsepower":85,
     "Weight_in_lbs":2990,
     "Acceleration":18.2,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford fairmont 4",
     "Miles_per_Gallon":22.3,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":88,
     "Weight_in_lbs":2890,
     "Acceleration":17.3,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc concord dl 6",
     "Miles_per_Gallon":20.2,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":90,
     "Weight_in_lbs":3265,
     "Acceleration":18.2,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge aspen 6",
     "Miles_per_Gallon":20.6,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":110,
     "Weight_in_lbs":3360,
     "Acceleration":16.6,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet caprice classic",
     "Miles_per_Gallon":17,
     "Cylinders":8,
     "Displacement":305,
     "Horsepower":130,
     "Weight_in_lbs":3840,
     "Acceleration":15.4,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford ltd landau",
     "Miles_per_Gallon":17.6,
     "Cylinders":8,
     "Displacement":302,
     "Horsepower":129,
     "Weight_in_lbs":3725,
     "Acceleration":13.4,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury grand marquis",
     "Miles_per_Gallon":16.5,
     "Cylinders":8,
     "Displacement":351,
     "Horsepower":138,
     "Weight_in_lbs":3955,
     "Acceleration":13.2,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge st. regis",
     "Miles_per_Gallon":18.2,
     "Cylinders":8,
     "Displacement":318,
     "Horsepower":135,
     "Weight_in_lbs":3830,
     "Acceleration":15.2,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick estate wagon (sw)",
     "Miles_per_Gallon":16.9,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":155,
     "Weight_in_lbs":4360,
     "Acceleration":14.9,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford country squire (sw)",
     "Miles_per_Gallon":15.5,
     "Cylinders":8,
     "Displacement":351,
     "Horsepower":142,
     "Weight_in_lbs":4054,
     "Acceleration":14.3,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet malibu classic (sw)",
     "Miles_per_Gallon":19.2,
     "Cylinders":8,
     "Displacement":267,
     "Horsepower":125,
     "Weight_in_lbs":3605,
     "Acceleration":15,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chrysler lebaron town @ country (sw)",
     "Miles_per_Gallon":18.5,
     "Cylinders":8,
     "Displacement":360,
     "Horsepower":150,
     "Weight_in_lbs":3940,
     "Acceleration":13,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"vw rabbit custom",
     "Miles_per_Gallon":31.9,
     "Cylinders":4,
     "Displacement":89,
     "Horsepower":71,
     "Weight_in_lbs":1925,
     "Acceleration":14,
     "Year":"1979-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"maxda glc deluxe",
     "Miles_per_Gallon":34.1,
     "Cylinders":4,
     "Displacement":86,
     "Horsepower":65,
     "Weight_in_lbs":1975,
     "Acceleration":15.2,
     "Year":"1979-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"dodge colt hatchback custom",
     "Miles_per_Gallon":35.7,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":80,
     "Weight_in_lbs":1915,
     "Acceleration":14.4,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc spirit dl",
     "Miles_per_Gallon":27.4,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":80,
     "Weight_in_lbs":2670,
     "Acceleration":15,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercedes benz 300d",
     "Miles_per_Gallon":25.4,
     "Cylinders":5,
     "Displacement":183,
     "Horsepower":77,
     "Weight_in_lbs":3530,
     "Acceleration":20.1,
     "Year":"1979-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"cadillac eldorado",
     "Miles_per_Gallon":23,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":125,
     "Weight_in_lbs":3900,
     "Acceleration":17.4,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"peugeot 504",
     "Miles_per_Gallon":27.2,
     "Cylinders":4,
     "Displacement":141,
     "Horsepower":71,
     "Weight_in_lbs":3190,
     "Acceleration":24.8,
     "Year":"1979-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"oldsmobile cutlass salon brougham",
     "Miles_per_Gallon":23.9,
     "Cylinders":8,
     "Displacement":260,
     "Horsepower":90,
     "Weight_in_lbs":3420,
     "Acceleration":22.2,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth horizon",
     "Miles_per_Gallon":34.2,
     "Cylinders":4,
     "Displacement":105,
     "Horsepower":70,
     "Weight_in_lbs":2200,
     "Acceleration":13.2,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth horizon tc3",
     "Miles_per_Gallon":34.5,
     "Cylinders":4,
     "Displacement":105,
     "Horsepower":70,
     "Weight_in_lbs":2150,
     "Acceleration":14.9,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun 210",
     "Miles_per_Gallon":31.8,
     "Cylinders":4,
     "Displacement":85,
     "Horsepower":65,
     "Weight_in_lbs":2020,
     "Acceleration":19.2,
     "Year":"1979-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"fiat strada custom",
     "Miles_per_Gallon":37.3,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":69,
     "Weight_in_lbs":2130,
     "Acceleration":14.7,
     "Year":"1979-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"buick skylark limited",
     "Miles_per_Gallon":28.4,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":90,
     "Weight_in_lbs":2670,
     "Acceleration":16,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet citation",
     "Miles_per_Gallon":28.8,
     "Cylinders":6,
     "Displacement":173,
     "Horsepower":115,
     "Weight_in_lbs":2595,
     "Acceleration":11.3,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"oldsmobile omega brougham",
     "Miles_per_Gallon":26.8,
     "Cylinders":6,
     "Displacement":173,
     "Horsepower":115,
     "Weight_in_lbs":2700,
     "Acceleration":12.9,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac phoenix",
     "Miles_per_Gallon":33.5,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":90,
     "Weight_in_lbs":2556,
     "Acceleration":13.2,
     "Year":"1979-01-01",
     "Origin":"USA"
  },
  {
     "Name":"vw rabbit",
     "Miles_per_Gallon":41.5,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":76,
     "Weight_in_lbs":2144,
     "Acceleration":14.7,
     "Year":"1980-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"toyota corolla tercel",
     "Miles_per_Gallon":38.1,
     "Cylinders":4,
     "Displacement":89,
     "Horsepower":60,
     "Weight_in_lbs":1968,
     "Acceleration":18.8,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"chevrolet chevette",
     "Miles_per_Gallon":32.1,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":70,
     "Weight_in_lbs":2120,
     "Acceleration":15.5,
     "Year":"1980-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun 310",
     "Miles_per_Gallon":37.2,
     "Cylinders":4,
     "Displacement":86,
     "Horsepower":65,
     "Weight_in_lbs":2019,
     "Acceleration":16.4,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"chevrolet citation",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":90,
     "Weight_in_lbs":2678,
     "Acceleration":16.5,
     "Year":"1980-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford fairmont",
     "Miles_per_Gallon":26.4,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":88,
     "Weight_in_lbs":2870,
     "Acceleration":18.1,
     "Year":"1980-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc concord",
     "Miles_per_Gallon":24.3,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":90,
     "Weight_in_lbs":3003,
     "Acceleration":20.1,
     "Year":"1980-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge aspen",
     "Miles_per_Gallon":19.1,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":90,
     "Weight_in_lbs":3381,
     "Acceleration":18.7,
     "Year":"1980-01-01",
     "Origin":"USA"
  },
  {
     "Name":"audi 4000",
     "Miles_per_Gallon":34.3,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":78,
     "Weight_in_lbs":2188,
     "Acceleration":15.8,
     "Year":"1980-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"toyota corona liftback",
     "Miles_per_Gallon":29.8,
     "Cylinders":4,
     "Displacement":134,
     "Horsepower":90,
     "Weight_in_lbs":2711,
     "Acceleration":15.5,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"mazda 626",
     "Miles_per_Gallon":31.3,
     "Cylinders":4,
     "Displacement":120,
     "Horsepower":75,
     "Weight_in_lbs":2542,
     "Acceleration":17.5,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"datsun 510 hatchback",
     "Miles_per_Gallon":37,
     "Cylinders":4,
     "Displacement":119,
     "Horsepower":92,
     "Weight_in_lbs":2434,
     "Acceleration":15,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"toyota corolla",
     "Miles_per_Gallon":32.2,
     "Cylinders":4,
     "Displacement":108,
     "Horsepower":75,
     "Weight_in_lbs":2265,
     "Acceleration":15.2,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"mazda glc",
     "Miles_per_Gallon":46.6,
     "Cylinders":4,
     "Displacement":86,
     "Horsepower":65,
     "Weight_in_lbs":2110,
     "Acceleration":17.9,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"dodge colt",
     "Miles_per_Gallon":27.9,
     "Cylinders":4,
     "Displacement":156,
     "Horsepower":105,
     "Weight_in_lbs":2800,
     "Acceleration":14.4,
     "Year":"1980-01-01",
     "Origin":"USA"
  },
  {
     "Name":"datsun 210",
     "Miles_per_Gallon":40.8,
     "Cylinders":4,
     "Displacement":85,
     "Horsepower":65,
     "Weight_in_lbs":2110,
     "Acceleration":19.2,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"vw rabbit c (diesel)",
     "Miles_per_Gallon":44.3,
     "Cylinders":4,
     "Displacement":90,
     "Horsepower":48,
     "Weight_in_lbs":2085,
     "Acceleration":21.7,
     "Year":"1980-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"vw dasher (diesel)",
     "Miles_per_Gallon":43.4,
     "Cylinders":4,
     "Displacement":90,
     "Horsepower":48,
     "Weight_in_lbs":2335,
     "Acceleration":23.7,
     "Year":"1980-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"audi 5000s (diesel)",
     "Miles_per_Gallon":36.4,
     "Cylinders":5,
     "Displacement":121,
     "Horsepower":67,
     "Weight_in_lbs":2950,
     "Acceleration":19.9,
     "Year":"1980-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"mercedes-benz 240d",
     "Miles_per_Gallon":30,
     "Cylinders":4,
     "Displacement":146,
     "Horsepower":67,
     "Weight_in_lbs":3250,
     "Acceleration":21.8,
     "Year":"1980-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"honda civic 1500 gl",
     "Miles_per_Gallon":44.6,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":67,
     "Weight_in_lbs":1850,
     "Acceleration":13.8,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"renault lecar deluxe",
     "Miles_per_Gallon":40.9,
     "Cylinders":4,
     "Displacement":85,
     "Horsepower":null,
     "Weight_in_lbs":1835,
     "Acceleration":17.3,
     "Year":"1980-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"subaru dl",
     "Miles_per_Gallon":33.8,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":67,
     "Weight_in_lbs":2145,
     "Acceleration":18,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"vokswagen rabbit",
     "Miles_per_Gallon":29.8,
     "Cylinders":4,
     "Displacement":89,
     "Horsepower":62,
     "Weight_in_lbs":1845,
     "Acceleration":15.3,
     "Year":"1980-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"datsun 280-zx",
     "Miles_per_Gallon":32.7,
     "Cylinders":6,
     "Displacement":168,
     "Horsepower":132,
     "Weight_in_lbs":2910,
     "Acceleration":11.4,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"mazda rx-7 gs",
     "Miles_per_Gallon":23.7,
     "Cylinders":3,
     "Displacement":70,
     "Horsepower":100,
     "Weight_in_lbs":2420,
     "Acceleration":12.5,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"triumph tr7 coupe",
     "Miles_per_Gallon":35,
     "Cylinders":4,
     "Displacement":122,
     "Horsepower":88,
     "Weight_in_lbs":2500,
     "Acceleration":15.1,
     "Year":"1980-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"ford mustang cobra",
     "Miles_per_Gallon":23.6,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":null,
     "Weight_in_lbs":2905,
     "Acceleration":14.3,
     "Year":"1980-01-01",
     "Origin":"USA"
  },
  {
     "Name":"honda Accelerationord",
     "Miles_per_Gallon":32.4,
     "Cylinders":4,
     "Displacement":107,
     "Horsepower":72,
     "Weight_in_lbs":2290,
     "Acceleration":17,
     "Year":"1980-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"plymouth reliant",
     "Miles_per_Gallon":27.2,
     "Cylinders":4,
     "Displacement":135,
     "Horsepower":84,
     "Weight_in_lbs":2490,
     "Acceleration":15.7,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"buick skylark",
     "Miles_per_Gallon":26.6,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":84,
     "Weight_in_lbs":2635,
     "Acceleration":16.4,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge aries wagon (sw)",
     "Miles_per_Gallon":25.8,
     "Cylinders":4,
     "Displacement":156,
     "Horsepower":92,
     "Weight_in_lbs":2620,
     "Acceleration":14.4,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet citation",
     "Miles_per_Gallon":23.5,
     "Cylinders":6,
     "Displacement":173,
     "Horsepower":110,
     "Weight_in_lbs":2725,
     "Acceleration":12.6,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"plymouth reliant",
     "Miles_per_Gallon":30,
     "Cylinders":4,
     "Displacement":135,
     "Horsepower":84,
     "Weight_in_lbs":2385,
     "Acceleration":12.9,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota starlet",
     "Miles_per_Gallon":39.1,
     "Cylinders":4,
     "Displacement":79,
     "Horsepower":58,
     "Weight_in_lbs":1755,
     "Acceleration":16.9,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"plymouth champ",
     "Miles_per_Gallon":39,
     "Cylinders":4,
     "Displacement":86,
     "Horsepower":64,
     "Weight_in_lbs":1875,
     "Acceleration":16.4,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"honda civic 1300",
     "Miles_per_Gallon":35.1,
     "Cylinders":4,
     "Displacement":81,
     "Horsepower":60,
     "Weight_in_lbs":1760,
     "Acceleration":16.1,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"subaru",
     "Miles_per_Gallon":32.3,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":67,
     "Weight_in_lbs":2065,
     "Acceleration":17.8,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"datsun 210",
     "Miles_per_Gallon":37,
     "Cylinders":4,
     "Displacement":85,
     "Horsepower":65,
     "Weight_in_lbs":1975,
     "Acceleration":19.4,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"toyota tercel",
     "Miles_per_Gallon":37.7,
     "Cylinders":4,
     "Displacement":89,
     "Horsepower":62,
     "Weight_in_lbs":2050,
     "Acceleration":17.3,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"mazda glc 4",
     "Miles_per_Gallon":34.1,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":68,
     "Weight_in_lbs":1985,
     "Acceleration":16,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"plymouth horizon 4",
     "Miles_per_Gallon":34.7,
     "Cylinders":4,
     "Displacement":105,
     "Horsepower":63,
     "Weight_in_lbs":2215,
     "Acceleration":14.9,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford escort 4w",
     "Miles_per_Gallon":34.4,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":65,
     "Weight_in_lbs":2045,
     "Acceleration":16.2,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford escort 2h",
     "Miles_per_Gallon":29.9,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":65,
     "Weight_in_lbs":2380,
     "Acceleration":20.7,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volkswagen jetta",
     "Miles_per_Gallon":33,
     "Cylinders":4,
     "Displacement":105,
     "Horsepower":74,
     "Weight_in_lbs":2190,
     "Acceleration":14.2,
     "Year":"1982-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"renault 18i",
     "Miles_per_Gallon":34.5,
     "Cylinders":4,
     "Displacement":100,
     "Horsepower":null,
     "Weight_in_lbs":2320,
     "Acceleration":15.8,
     "Year":"1982-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"honda prelude",
     "Miles_per_Gallon":33.7,
     "Cylinders":4,
     "Displacement":107,
     "Horsepower":75,
     "Weight_in_lbs":2210,
     "Acceleration":14.4,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"toyota corolla",
     "Miles_per_Gallon":32.4,
     "Cylinders":4,
     "Displacement":108,
     "Horsepower":75,
     "Weight_in_lbs":2350,
     "Acceleration":16.8,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"datsun 200sx",
     "Miles_per_Gallon":32.9,
     "Cylinders":4,
     "Displacement":119,
     "Horsepower":100,
     "Weight_in_lbs":2615,
     "Acceleration":14.8,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"mazda 626",
     "Miles_per_Gallon":31.6,
     "Cylinders":4,
     "Displacement":120,
     "Horsepower":74,
     "Weight_in_lbs":2635,
     "Acceleration":18.3,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"peugeot 505s turbo diesel",
     "Miles_per_Gallon":28.1,
     "Cylinders":4,
     "Displacement":141,
     "Horsepower":80,
     "Weight_in_lbs":3230,
     "Acceleration":20.4,
     "Year":"1982-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"saab 900s",
     "Miles_per_Gallon":null,
     "Cylinders":4,
     "Displacement":121,
     "Horsepower":110,
     "Weight_in_lbs":2800,
     "Acceleration":15.4,
     "Year":"1982-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"volvo diesel",
     "Miles_per_Gallon":30.7,
     "Cylinders":6,
     "Displacement":145,
     "Horsepower":76,
     "Weight_in_lbs":3160,
     "Acceleration":19.6,
     "Year":"1982-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"toyota cressida",
     "Miles_per_Gallon":25.4,
     "Cylinders":6,
     "Displacement":168,
     "Horsepower":116,
     "Weight_in_lbs":2900,
     "Acceleration":12.6,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"datsun 810 maxima",
     "Miles_per_Gallon":24.2,
     "Cylinders":6,
     "Displacement":146,
     "Horsepower":120,
     "Weight_in_lbs":2930,
     "Acceleration":13.8,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"buick century",
     "Miles_per_Gallon":22.4,
     "Cylinders":6,
     "Displacement":231,
     "Horsepower":110,
     "Weight_in_lbs":3415,
     "Acceleration":15.8,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"oldsmobile cutlass ls",
     "Miles_per_Gallon":26.6,
     "Cylinders":8,
     "Displacement":350,
     "Horsepower":105,
     "Weight_in_lbs":3725,
     "Acceleration":19,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford granada gl",
     "Miles_per_Gallon":20.2,
     "Cylinders":6,
     "Displacement":200,
     "Horsepower":88,
     "Weight_in_lbs":3060,
     "Acceleration":17.1,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chrysler lebaron salon",
     "Miles_per_Gallon":17.6,
     "Cylinders":6,
     "Displacement":225,
     "Horsepower":85,
     "Weight_in_lbs":3465,
     "Acceleration":16.6,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet cavalier",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":112,
     "Horsepower":88,
     "Weight_in_lbs":2605,
     "Acceleration":19.6,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet cavalier wagon",
     "Miles_per_Gallon":27,
     "Cylinders":4,
     "Displacement":112,
     "Horsepower":88,
     "Weight_in_lbs":2640,
     "Acceleration":18.6,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet cavalier 2-door",
     "Miles_per_Gallon":34,
     "Cylinders":4,
     "Displacement":112,
     "Horsepower":88,
     "Weight_in_lbs":2395,
     "Acceleration":18,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac j2000 se hatchback",
     "Miles_per_Gallon":31,
     "Cylinders":4,
     "Displacement":112,
     "Horsepower":85,
     "Weight_in_lbs":2575,
     "Acceleration":16.2,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"dodge aries se",
     "Miles_per_Gallon":29,
     "Cylinders":4,
     "Displacement":135,
     "Horsepower":84,
     "Weight_in_lbs":2525,
     "Acceleration":16,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"pontiac phoenix",
     "Miles_per_Gallon":27,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":90,
     "Weight_in_lbs":2735,
     "Acceleration":18,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford fairmont futura",
     "Miles_per_Gallon":24,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":92,
     "Weight_in_lbs":2865,
     "Acceleration":16.4,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"amc concord dl",
     "Miles_per_Gallon":23,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":null,
     "Weight_in_lbs":3035,
     "Acceleration":20.5,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"volkswagen rabbit l",
     "Miles_per_Gallon":36,
     "Cylinders":4,
     "Displacement":105,
     "Horsepower":74,
     "Weight_in_lbs":1980,
     "Acceleration":15.3,
     "Year":"1982-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"mazda glc custom l",
     "Miles_per_Gallon":37,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":68,
     "Weight_in_lbs":2025,
     "Acceleration":18.2,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"mazda glc custom",
     "Miles_per_Gallon":31,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":68,
     "Weight_in_lbs":1970,
     "Acceleration":17.6,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"plymouth horizon miser",
     "Miles_per_Gallon":38,
     "Cylinders":4,
     "Displacement":105,
     "Horsepower":63,
     "Weight_in_lbs":2125,
     "Acceleration":14.7,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"mercury lynx l",
     "Miles_per_Gallon":36,
     "Cylinders":4,
     "Displacement":98,
     "Horsepower":70,
     "Weight_in_lbs":2125,
     "Acceleration":17.3,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"nissan stanza xe",
     "Miles_per_Gallon":36,
     "Cylinders":4,
     "Displacement":120,
     "Horsepower":88,
     "Weight_in_lbs":2160,
     "Acceleration":14.5,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"honda Accelerationord",
     "Miles_per_Gallon":36,
     "Cylinders":4,
     "Displacement":107,
     "Horsepower":75,
     "Weight_in_lbs":2205,
     "Acceleration":14.5,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"toyota corolla",
     "Miles_per_Gallon":34,
     "Cylinders":4,
     "Displacement":108,
     "Horsepower":70,
     "Weight_in_lbs":2245,
     "Acceleration":16.9,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"honda civic",
     "Miles_per_Gallon":38,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":67,
     "Weight_in_lbs":1965,
     "Acceleration":15,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"honda civic (auto)",
     "Miles_per_Gallon":32,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":67,
     "Weight_in_lbs":1965,
     "Acceleration":15.7,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"datsun 310 gx",
     "Miles_per_Gallon":38,
     "Cylinders":4,
     "Displacement":91,
     "Horsepower":67,
     "Weight_in_lbs":1995,
     "Acceleration":16.2,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"buick century limited",
     "Miles_per_Gallon":25,
     "Cylinders":6,
     "Displacement":181,
     "Horsepower":110,
     "Weight_in_lbs":2945,
     "Acceleration":16.4,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"oldsmobile cutlass ciera (diesel)",
     "Miles_per_Gallon":38,
     "Cylinders":6,
     "Displacement":262,
     "Horsepower":85,
     "Weight_in_lbs":3015,
     "Acceleration":17,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chrysler lebaron medallion",
     "Miles_per_Gallon":26,
     "Cylinders":4,
     "Displacement":156,
     "Horsepower":92,
     "Weight_in_lbs":2585,
     "Acceleration":14.5,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford granada l",
     "Miles_per_Gallon":22,
     "Cylinders":6,
     "Displacement":232,
     "Horsepower":112,
     "Weight_in_lbs":2835,
     "Acceleration":14.7,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"toyota celica gt",
     "Miles_per_Gallon":32,
     "Cylinders":4,
     "Displacement":144,
     "Horsepower":96,
     "Weight_in_lbs":2665,
     "Acceleration":13.9,
     "Year":"1982-01-01",
     "Origin":"Japan"
  },
  {
     "Name":"dodge charger 2.2",
     "Miles_per_Gallon":36,
     "Cylinders":4,
     "Displacement":135,
     "Horsepower":84,
     "Weight_in_lbs":2370,
     "Acceleration":13,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevrolet camaro",
     "Miles_per_Gallon":27,
     "Cylinders":4,
     "Displacement":151,
     "Horsepower":90,
     "Weight_in_lbs":2950,
     "Acceleration":17.3,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford mustang gl",
     "Miles_per_Gallon":27,
     "Cylinders":4,
     "Displacement":140,
     "Horsepower":86,
     "Weight_in_lbs":2790,
     "Acceleration":15.6,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"vw pickup",
     "Miles_per_Gallon":44,
     "Cylinders":4,
     "Displacement":97,
     "Horsepower":52,
     "Weight_in_lbs":2130,
     "Acceleration":24.6,
     "Year":"1982-01-01",
     "Origin":"Europe"
  },
  {
     "Name":"dodge rampage",
     "Miles_per_Gallon":32,
     "Cylinders":4,
     "Displacement":135,
     "Horsepower":84,
     "Weight_in_lbs":2295,
     "Acceleration":11.6,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"ford ranger",
     "Miles_per_Gallon":28,
     "Cylinders":4,
     "Displacement":120,
     "Horsepower":79,
     "Weight_in_lbs":2625,
     "Acceleration":18.6,
     "Year":"1982-01-01",
     "Origin":"USA"
  },
  {
     "Name":"chevy s-10",
     "Miles_per_Gallon":31,
     "Cylinders":4,
     "Displacement":119,
     "Horsepower":82,
     "Weight_in_lbs":2720,
     "Acceleration":19.4,
     "Year":"1982-01-01",
     "Origin":"USA"
  }
];
dbo.insertMany(myobj, function(err, res) {
  if (err) throw err;
  console.log("Number of documents inserted: " + res.insertedCount);    
  db.close();
});
}
