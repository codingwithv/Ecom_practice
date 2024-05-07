const express = require("express");
const dbConnect = require("./db/db.js");
const app = express();
const path = require("path");
// const Product = require("./model/productModel.js");
const User = require("./model/userModel.js");
const methodOverride = require("method-override");
const ProductRouter = require("./routes/productRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const session = require("express-session");
const ejsmate = require("ejs-mate");
const flash = require("connect-flash");
const port = 5000;
const passport = require("passport");
const LocalStrategy = require("passport-local");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 * 1,
    },
  })
);

passport.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", "views");

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  console.log(req.user);
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.info = req.flash("info");
  res.locals.warning = req.flash("warning");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.use(ProductRouter);
app.use(userRouter);
dbConnect();

app.listen(port, () => {
  console.log(`Server running on port ${port} 🔥`);
});
