const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const User = require('./user');
const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
    title:String,
    price:Number,
    location:String,
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    discription:String,
    image:{
        url:String,
        fileName:String
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts)
campgroundSchema.virtual('properties.popuptex').get(function(){
    return ` <h4> <a href="/campgrounds/${this._id}">${this.title}</a> </h4>`; 
})
campgroundSchema.post('findOneAndDelete',  async function (doc){
    console.log(doc);
    if(doc){
        await Review.deleteMany({_id:{$in:doc.review}});
    }
})
const campground = new mongoose.model('Campground',campgroundSchema);


module.exports = campground;