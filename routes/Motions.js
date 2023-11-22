const express = require('express');
const MotionModel = require('../model/MotionModel');

const router = express.Router();


router.post('/motion', async (req, res) => {
    try {
        
        const { detection } = req.body;

        const newMotionData = new MotionModel({ detection });

    
        await newMotionData.save();

        res.status(200).json({ message: 'Motion data saved' });
    } catch (error) {
        console.error('Error saving motion data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//GET

router.get('/getMotion', async(req,res)=>{
    try {
        const motion = await MotionModel.findOne().sort({ time: -1});

        if (motion) {
            res.json({detection: motion.detection});
        } else {
            res.status(404).json({message: 'no data'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
module.exports = router;

// PATCH

router.patch('/updateMotion', async (req, res) => {
    try {
        const { detection } = req.body;

        const latestMotionData = await MotionModel.findOne().sort({ time: -1 });

        if (latestMotionData) {
            latestMotionData.detection = detection;
            await latestMotionData.save();

            res.json({ message: 'Motion status updated successfully' });
        } else {
            res.status(404).json({ message: 'No data to update' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


