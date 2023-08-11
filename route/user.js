const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchErr = require('../errUtils/catchErr');


router.get('/register',async(req,res)=>{
    res.render('users/register');
})
router.post('/register',catchErr(async(req,res)=>{
    try{
        const{username,email,password}=req.body;
        const user = new User({
            username:username,
            email:email
        });
        const newUser = await User.register(user,password);
        req.login(newUser,function(err) {
            if (err) { return next(err); }
            req.flash('sucess','welcome to YelpCamp');
            res.redirect('/');
            });
        
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
}))
router.get('/login',(req,res)=>{
     res.render('users/login');
})
router.get('/logout',(req,res)=>{
        req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','Logout successfully');
       
        res.redirect('/');
        });
    // res.redirect('/');
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) ,async(req,res)=>{
       req.flash('success','welcome Back!!');
       console.log(req.session);
       const returnTo = req.session.returnTo || '/';
       res.redirect(returnTo);
})
module.exports=router;