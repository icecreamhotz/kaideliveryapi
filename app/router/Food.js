const express = require('express')
const router = express.Router()
const foods = require('../controller/FoodController')
const multer = require('multer')
const moment = require('moment')

const pathName = '../public/images/foods/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pathName)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

router.get('/all/restaurant/:restId', foods.showAllFoodsDataByResId)
router.get('/:foodId/restaurant/:restId', foods.showFoodsDataByResId)
router.post('/create', upload.any(), foods.insertFoodsData)
router.post('/update/:foodId', upload.any(), foods.updateFoodsData)

module.exports = router