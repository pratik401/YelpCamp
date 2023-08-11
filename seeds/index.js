
const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');
const {descriptors,places}=require('./seedHelper');
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


const randtitle = (arr)=> arr[Math.floor(Math.random()*arr.length)];
const seedData = async ()=>{
    await campground.deleteMany({});
    for(let i=0;i<300;i++){
        const p = Math.floor(Math.random()*20) +10;
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,

            author:'63fede7092ae85e3367f64c1',
            geometry: { type: 'Point', 
            coordinates: [ cities[random1000].longitude,cities[random1000].latitude ]
                      },
            price:p,
            discription:'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Id, facere quasi nam consectetur blanditiis ducimus maiores accusantium, dicta, culpa nobis magnam. Vitae error obcaecati animi facere, deserunt accusamus rem temporibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. In explicabo quidem maiores, nesciunt ex voluptatem cumque porro nobis quasi! Ullam dolore officiis rem vero, quae dolor cumque in minima at. Lorem ipsum dolor sit amet consectetu adipisicing elit. Praesentium deserunt, minima iste quasi corrupti ex nihi fugit. Tenetur error quaerat ipsam sit, molestiae deserunt itaque enim quidem modi veniam asperiores',
            title:`${randtitle(places)} ${randtitle(descriptors)}`,
            image:{
                url:'https://res.cloudinary.com/dy3gqxd48/image/upload/v1679373807/YelpCamp/bwlnxi4nford8cvgrng7.jpg',
                fileName:'YelpCamp/bwlnxi4nford8cvgrng7'
            }
        })
       
        await camp.save();

    }
    
}

seedData().then(() => {
    mongoose.connection.close();
})