
const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;    

const reviewSchema = new Schema({
    rating:Number,
    review:String,
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review;