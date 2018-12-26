const express     = require("express"),
			app         = express(),
			bodyParser  = require("body-parser"),
			mongoose    = require("mongoose"),			
			flash       = require("connect-flash"),
			passport    = require("passport"),
			LocalStrategy = require("passport-local"),
			expressSection = require("express-session"),
			methodOverride = require("method-override"),
			User        = require("./models/user"),
			seedDB      = require("./seeds");
    
//requiring routes
const commentRoutes    = require("./routes/comments"),
			campgroundRoutes = require("./routes/campgrounds"),
			indexRoutes      = require("./routes/index");
 
const url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(url, {useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); //initiate database with sample camps

// PASSPORT CONFIGURATION
app.use(expressSection({
	secret: "fancy feast turkey giblets for Jasper",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//organize all the routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//process.env.IP || '127.0.0.1'
//start the server
app.listen(process.env.PORT || 3000, function(){
  console.log("The Server Has Started!");
});