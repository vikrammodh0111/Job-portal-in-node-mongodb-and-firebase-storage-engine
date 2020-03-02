var createError = require("http-errors");
var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var recruiterRouter = require("./routes/recruiter");

const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const expressHbs = require("express-handlebars");
const Mongo = require("connect-mongo")(session);
const dotenv = require("dotenv");
const Handlebars = require("handlebars");
const flash = require("connect-flash");
const {
  allowInsecurePrototypeAccess
} = require("@handlebars/allow-prototype-access");
const mongoose = require("mongoose");

dotenv.config();
require("./Config/Passport");
mongoose.connect(
  "mongodb://127.0.0.1:27017/jobsforyou",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, result) => {
    if (err) {
      console.log(err);
    }
  }
);
// view engine setup
app.engine(
  ".hbs",
  expressHbs({
    defaultLayout: "layout",
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
  })
);
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "session secrete",
    resave: false,
    saveUninitialized: false,
    store: new Mongo({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 100 * 60 * 1000 }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use(flash());

app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/", recruiterRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
