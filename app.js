const express = require("express")
const mongoose = require("mongoose")
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require("cors")

const User = require("./models/user")
const AuthRoute = require('./routes/auth')
const UserRoute = require('./routes/users')

require("dotenv/config")

mongoose.connect(
    process.env.TEST_DB_CONNECTION_STRING,
    { useUnifiedTopology: true, useNewUrlParser: true }
    //,(req,res)=> {
    //console.log("Connected to the database");}
)

const db = mongoose.connection

db.on('error', (err) => {
    console.log(err)
})

db.once('open', () => {
    console.log('Database Connection Established')
})

const app = express()
app.use(cors())
app.use(express.json())

app.use('/users', UserRoute)
app.use('/auth', AuthRoute)

//app.use(morgan('dev'))
//app.use(bodyParser.urlencoded({extended: true}))
//app.use(bodyParser.json())




app.listen(3000, () => {
    console.log("Listening to 3000");
})




