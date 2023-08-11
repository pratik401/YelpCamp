const express = require('express');
const router= express.Router();
const Review = require('../models/review');
const catchErr = require('../errUtils/catchErr');
const ExpressErr = require('../errUtils/expressErr');
const campground = require('../models/campground');
const {isloggedIn,isAuthor} = require('../middlerware');
const multer  = require('multer');
const {storage}= require('../cloudinary');
const {cloudinary} = require('../cloudinary');
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});
router.get('/', catchErr(async(req,res)=>{
    const campgrounds = await campground.find({});
    res.render('campground/show',{campgrounds});
})) 

router.get('/new',isloggedIn, (req,res)=>{
    
    res.render('campground/new');
})
router.get('/:id', catchErr( async (req,res)=>{
    const {id}= req.params;
    const camp = await campground.findById(id).populate({
        path:'review',
        populate:{
        path:'user'
        }
    }).populate('author');
    
    if(!camp){
        throw new ExpressErr('page not found','400');
    }
    console.log(camp);
    res.render('campground/detail',{camp});
   
}))
router.get('/:id/edit',isloggedIn,isAuthor, catchErr(async(req,res)=>{
    const {id}=req.params;
    const camp  = await campground.findById(id);
    
    res.render('campground/edit',{camp});
})) 
router.delete('/:id',isloggedIn,isAuthor, catchErr(async(req,res)=>{
    const {id}= req.params;
    const camp = await campground.findById(id);
    const filename = camp.image.fileName;
    // console.log(filename);
    cloudinary.uploader.destroy(filename);
    await campground.findByIdAndDelete(id);
    req.flash('success','successfully deleted');
    res.redirect('/campgrounds');
} )) 



router.post('/',upload.single('image'), catchErr(async (req,res)=>{
   
    const geoData =  await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
   
    
    const camp = await new campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.image.url = req.file.path;
    camp.image.fileName = req.file.filename;
    camp.author=req.user._id;
    console.log(req.file);
    await camp.save();
    req.flash('success','sucessFully created campground');
    res.redirect(`/campgrounds/${camp._id}`);
    
})) 


router.put('/:id',isloggedIn,isAuthor,  catchErr(async(req,res)=>{
    const{id}=req.params;
    await campground.findByIdAndUpdate(id,req.body.campground);
    req.flash('success','successfully edited the campground');
    res.redirect(`/campgrounds/${id}`);
})) 

module.exports = router;