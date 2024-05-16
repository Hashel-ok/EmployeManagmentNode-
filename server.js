const express=require('express');
const connect_db = require('./config/dbConnect');
const bodyparser=require('body-parser')
const ejs=require('ejs')
const cookieParser = require("cookie-parser");
const flash=require('connect-flash')

const path = require('path');
const dotenv=require('dotenv').config()
const app=express();

const session=require('express-session')

const port=process.env.PORT|| 5000

app.use(express.json());   
app.use(cookieParser());
app.use(express.urlencoded({extended: false})); 
app.use(bodyparser.urlencoded({extended:true}));

app.use(flash())

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));



app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"));

connect_db();
app.use(express.static('public'))

app.use('/',require('./routes/userRoute'));
app.use('/employees',require('./routes/employeeRoute'))

app.listen(port, () => {

  console.log(`Server running http://localhost:${port}/user/login`)
})