//////// app.js

const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoDb = "mongodb://127.0.0.1:27017/authentication_basics";


async function connectDB() {
    try {
      await mongoose.connect(mongoDb);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Could not connect to MongoDB:', error);
    }
  }
  connectDB();
  


// mongoose.connect(mongoDb);
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
    "User",
    new Schema({
        username: {
            type: String, required: true
        },
        password: {
            type: String, required: true
        }
    })
);

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(session({secret: "cats", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("./views/index"));
app.get("/sign-up", (req, res) => res.render("./views/sign-up-form"));
app.post("/sign-up", async (req, res, next) => {

    try {
      const user = new User({
        username: req.body.username,
        password: req.body.password
      });
      
      const result = await user.save();


      res.redirect("/");
    } catch(err) {
      return next(err);
    };
  });


app.listen(3000, () => console.log("app listening on port 3000!"));