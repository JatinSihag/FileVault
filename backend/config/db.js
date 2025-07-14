const mongoose = require('mongoose')
require('dotenv').config();

function connectDb(){
    mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

}

module.exports = connectDb