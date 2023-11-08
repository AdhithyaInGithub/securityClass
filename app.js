require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption")

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema= new mongoose.Schema({
    email:String,
    password:String
});

console.log(process.env.API_KEY); //just for reference//

const secret=process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields:["password"] });

const User=mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save().then((e) => { res.render("secrets"); })
    .catch((err) => { console.log(err) })
    });

app.post("/login",function(req,res){
    User.findOne({email:req.body.username})
    .then(function(foundUser){
       if(!foundUser){
        res.send("<h1>***USER NOT FOUND***</h1>")
    }else{
        if(foundUser){
            if(foundUser.password==req.body.password){
                res.render("secrets")
            }else{
                res.send("<h1>***INCORRECT PASSWORD***</h1>")
            }
        }
    } 
    });
    
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
