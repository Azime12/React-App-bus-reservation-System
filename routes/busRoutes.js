const router = require('express').Router()
const Bus = require('../models/busModels')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/add-bus', authMiddleware, async (req,res) => {
    try{
       const existingBus = await Bus.findOne({number:req.body.number})
       if(existingBus){
        res.send({
            message:'Bus number already exists',
            success:false
        })
       }
       const newBus = new Bus(req.body);
       await newBus.save()
       return res.status(200).send({
        message:'Bus added successfully',
        status:true
       })
    } catch(err){
        return res.status(500).send({
            message:err.message,
            status:false
           })
    }
})

router.get('/get-all-bus', authMiddleware, async (req,res) => {
    try{
        console.log(req.body.tempFilters)
        const bus = await Bus.find(req.body.tempFilters)
        res.status(200).send({
            message:'Bus fetched',
            success:true,
            data:bus
        })
    } catch(err){
        res.status(402).send({
            message: err.message,
            status:false,
            data:null
        })
    }
})

router.post('/update-bus', authMiddleware, async (req,res) => {
    try{
        const bus = await Bus.findByIdAndUpdate(req.body._id,req.body)
        res.status(200).send({
            message:'Bus Updated Successfully',
            success:true,
            data:bus
        })
    } catch(err) {
        res.status(402).send({
            message: err.message,
            status:false,
            data:null
        })
    }
})

router.post('/delete-bus', authMiddleware, async (req,res) => {
    try{
        const bus = await Bus.findByIdAndDelete(req.body._id,req.body)
        res.status(200).send({
            message:'Bus Deleted Successfully',
            success:true,
        })
    } catch(err) {
        res.status(402).send({
            message: err.message,
            status:false,
        })
    }
})

router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
    try {
      const bus = await Bus.findById(req.body._id);
      return res.status(200).send({
        success: true,
        message: "Bus fetched successfully",
        data: bus,
      });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  });

module.exports = router