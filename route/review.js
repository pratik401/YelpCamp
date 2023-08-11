const express = require('express');
const router= express.Router({mergeParams:true});
const Review = require('../models/review');
const catchErr = require('../errUtils/catchErr');
const ExpressErr = require('../errUtils/expressErr');
const campground = require('../models/campground');
const {isloggedIn,isReviewAuthor}= require('../middlerware');


router.post('/',isloggedIn, catchErr(async(req,res)=>{
    const {id}=req.params;
    
    
    const camp = await campground.findById(id);
    
    const review = await new Review(req.body.rev);
    review.user=req.user._id;
    camp.review.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${id}`);
}))
router.delete('/:reviewId',isloggedIn,isReviewAuthor, catchErr(async(req,res)=>{
    const{id,reviewId}=req.params;
    await campground.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/campgrounds/${id}`);
}))

module.exports=router;
