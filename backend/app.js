const express = require('express')
const userRouter  = require('./routes/user.routes')
const indexRouter = require('./routes/index.routes')
const dotenv = require('dotenv')
dotenv.config();
const connectDb = require('./config/db')
connectDb();
const cookieParser = require('cookie-parser')
const app = express()
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // if you're using cookies or auth headers
}));


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

app.set('view engine','ejs')
app.use('/',indexRouter)
app.use('/user',userRouter)
app.use('/uploads',express.static('uploads'))

app.listen(3333,()=>{
    console.log("Server is running");
})