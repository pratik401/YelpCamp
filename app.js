if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
// console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Review = require('./models/review');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const catchErr = require('./errUtils/catchErr');
const ExpressErr = require('./errUtils/expressErr');
const campground = require('./models/campground');
const { access } = require('fs/promises');
const camproute = require('./route/campground');
const reviewrout = require('./route/review');
const userroute = require('./route/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser: true,
  
    useUnifiedTopology:true
}).then(()=>{
    console.log('mongo connected');
})
.catch((err)=>{
    console.log('error occur');
    console.log(err);
})


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:'thisisnotgoodsecret',
    resave:false,
    saveUninitialized:true,
    
    cookie:{
        maxAge:Date.now()*100*60*24*7,
        httpOnly:true
    }

}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.session);
    // console.log(req.user);
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.warn=req.flash('warn');
    res.locals.currentUser=req.user;
    next();
})
// app.use((req,res,next)=>{
//     console.log(req.user);
//     next();
// })
app.use('/',userroute);
app.use('/campgrounds',camproute);
app.use('/campgrounds/:id/review',reviewrout)

app.get('/',(req,res)=>{
    res.render('campground/home');
})




app.use((err,req,res,next)=>{
    const {status='500'}=err;
    if(!err.message){
        err.message='something went wrong';
    }
    res.status(status).render('err',{err});
})
app.listen('3000',()=>{
    console.log('listing on port 3000');
})