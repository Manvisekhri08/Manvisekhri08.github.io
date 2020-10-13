const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Patients = require("../models/patient")
require('dotenv/config')

const app = express();
// Setup handlebars engine and view location

// Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')));

app.set('views', path.join(__dirname, '../views'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


const connectionURL = process.env.DB_CONNECTION

//Connecting to DataBase
mongoose.connect(connectionURL,{ useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => {
        console.log("Connected to database!");
}).catch(() => {
    console.log("Connection failed!");
});
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup Server
const port = 3000;
const server = app.listen(process.env.PORT ||port, () => {
    console.log(`server is running on port: ${port}`);
});

//  app.get('', (req, res) => {
//     res.render('index')
//      })

app.get('/', function (req, res) {
   res.render('index')
})

//Fetching Patient Details
app.get('/data', (req, res) => {
    const MobNo = req.query.Mobno
    if (!MobNo) {
    return res.send({
      message: 'You must provide a Mobile Number'
    })
  }
    Patients.find({Mobno: MobNo}).then(data => {
        if (data && data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'Data doesnot exist! Please check your Mobile Number Again' });
        }
    }).catch(error => {
         res.status(500).json({
        message:  'Data doesnot exist! Please check your Mobile Number Again'
      });
      });
    }) 

app.get("/data/*", (req, res) => {
  res.status(200).json({ message: '404'});
  });

 app.get("*", (req, res) => {
  res.status(200).json({ message: '404'});
  });

