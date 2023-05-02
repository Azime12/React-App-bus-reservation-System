const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../models/usersModel')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', async (req,res) => {
    try{
        const existingUser = await User.findOne({email:req.body.email});
        if(existingUser){
            res.send({
                message:'User already exists',
                success:false,
                data:null
            })
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        req.body.password = hashedPassword
        const user = new User(req.body)
        await user.save()
        res.send({
            message:'user created',
            success:true,
            data:user
        })
    } catch(err){
        res.send({
            message: err.message,
            success:false,
            data:null
        })
    }
})

router.post('/login', async (req,res) => {

    try{
        const userEmailExist = await User.findOne({email:req.body.email})
        if(!userEmailExist){
            res.send({
                message:'email does not exists',
                success:false,
                data:null
            })
        }

        if (userEmailExist.isBlocked) {
            return res.send({
              message: "Your account is blocked , please contact admin",
              success: false,
              data: null,
            });
          }

        const passwordMatch = await bcrypt.compare(
            req.body.password,
            userEmailExist.password
        )

        if(!passwordMatch){
            res.send({
                message:'password not matched',
                success:false,
                data:null
            })
        }

        const token = jwt.sign(
            {userId:userEmailExist._id},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        );

        res.send({
            message:'User login successfully',
            success:true,
            data:token
        });
    } catch(err){
        res.send({
            message:err.message,
            success:false,
            data:null
        })
    }
    
})

router.post('/get-user-by-id', authMiddleware,  async (req,res) => {
    try{
        const user = await User.findById(req.body.userId)
       
            res.send({
                message:'user fetched successfully',
                success:true,
                data:user
            })
        
    } catch(err){
        res.send({
            message:err.message,
            success:false,
        })
    }
   
})

router.post("/get-all-users", authMiddleware, async (req, res) => {
    try {
      const users = await User.find({});
      res.send({
        message: "Users fetched successfully",
        success: true,
        data: users,
      });
    } catch (error) {
      res.send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  });
  
  // update user
  
  router.post("/update-user-permissions", authMiddleware, async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.body._id, req.body);
      res.send({
        message: "User permissions updated successfully",
        success: true,
        data: null,
      });
    } catch {
      res.send({
        message: error.message,
        success: false,
        data: null,
      });
    }
  });
module.exports = router