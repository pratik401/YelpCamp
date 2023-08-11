const campground=require('./models/campground');
const Review = require('./models/review');
module.exports.isloggedIn = (req,res,next)=>{
    // console.log("currentUser...",req.user);

    if(!req.isAuthenticated()){
        // console.log(req.path,req.origin
        req.session.returnTo=req.originalUrl;
        // console.log(req.session);
        req.flash('error','please log in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req,res,next)=>{
    const {id}=req.params;
    const camp  = await campground.findById(id);
    if(!camp.author.equals(req.user._id)){
      req.flash('error','You do not have permission');
      return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review  = await Review.findById(reviewId);
    if(!review.user.equals(req.user._id)){
      req.flash('error','You do not have permission');
      return res.redirect(`/campgrounds/${id}`);
    }
    next();
}