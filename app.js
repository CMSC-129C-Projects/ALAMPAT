const express     = require("express")
const mongoose    = require("mongoose")
const morgan      = require('morgan')

const cors        = require("cors")

const User        = require("./models/user")
const AuthRoute   = require('./routes/auth')
const UserRoute   = require('./routes/users')
const SellerRoute = require('./routes/seller')
const BuyerRoute  = require('./routes/buyer')

require("dotenv/config")

mongoose.connect(
    process.env.TEST_DB_CONNECTION_STRING,
    { useUnifiedTopology: true, useNewUrlParser: true, 
        useCreateIndex: true, useFindAndModify: false 
    })
   
    //,(req,res)=> {
    //console.log("Connected to the database");}


const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database Connection Established')
})

const app = express()
app.use(cors())

app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'))
//app.use('/profileUploads', express.static('profileUploads'));
//app.use(bodyParser.urlencoded({extended: false}))

//app.use(bodyParser.json())


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

app.post('/', (req,res) =>{})



app.use('/auth', AuthRoute)
app.use('/users', UserRoute)
app.use('/seller', SellerRoute)
app.use('/buyer', BuyerRoute)


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });


app.listen(3000, () => {
    console.log("Listening to 3000");
})




