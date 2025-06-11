const express= require('express');
const router = express.Router();
const {body,validationResult} =require('express-validator')
const userModel = require('../Models/user.models');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' }); // or configure as needed


const auth = require('../middlewares/auth');
const jwt = require('jsonwebtoken')


router.get('/profile',auth ,async(req,res)=>{
  try{
    const user = await userModel.findById(req.user.userId).select('-password');
    if(!user){
      return res.status(404).json({
        message: 'User not found'
      })
    }
    res.json({user});
  }catch(err){
    res.status(500).json({
      error:'Server Error'
    })
  };
})
router.post('/profile/photo',auth,upload.single('photo'),async (req,res)=>{
  try{
    const user = await userModel.findById(req.user.userId);
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({profilePicture: user.profilePicture});
  }
  catch(err){
    res.status(500).json({
      error:'Server Error'
    })
  }
})
// register
router.get('/register',(req,res)=>{
    res.render('register')
})
router.post('/register',
  body('email').trim().isEmail().isLength({ min: 10 }),
  body('password').trim().isLength({ min: 5 }),
  body('username').trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Invalid Data',
      });
    }

    const { email, username, password } = req.body;

    try {
      const newUser = await userModel.create({
        email,
        username,
        password,
      });
      return res.status(201).json({ message: 'User registered', user: newUser });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          error: 'Username or email already exists',
        });
      }

      console.error('Server error:', err);
      return res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  }
);


//login
router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/login',
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({min:5}),
    async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            error :errors.array(),
            message : 'Invalid Data'
        })
    }
    const {username,password}=req.body;
    const user = await userModel.findOne({
        username:username
    })   
    if(!user){
        return res.status(400).json({
            message:'Username is incorrect'
        });
    }
    const isMatch = password === user.password
    if(!isMatch){
        return res.status(400).json({
            message:'password is incorrect',    
        })
    }
    const token = jwt.sign({
    userId: user._id,
    email: user.email,
    username: user.username,
    profilePicture: user.profilePicture
}, process.env.JWT_SECRET, { expiresIn: '1h' });

res.cookie('token', token, {
  httpOnly: true, 
  maxAge: 3600000 
});
res.json({
  token,
  user: {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture
  }
});
})

module.exports = router