const express = require('express');
const lightModel = require('../model/LightLevelModel');

const router = express.Router()

//Post method
router.post('/post', async(req, res)=>
{
    const data= new lightModel(
        {
        lightLevel: req.body.lightLevel,
        time: req.body.time
    }
    )

    try {
        const dataToSave = await data.save();
        res.status(200).json(data)
    } catch(error) {
        res.status(200).json(dataToSave)
    }
})
//GetAllMethod
router.get('/getLightLevels' , async (req, res)=>{
    try {
        const data= await lightModel.find().sort({ time: -1 }).limit(1);
        res.json(data)
    }catch(error) {

    }
})

module.exports = router;