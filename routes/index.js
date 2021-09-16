const express = require('express')
const router = express.Router()
const Meal = require('../models/meal')

router.get('/', async (req, res) => {
  let meals
  try {
    meals = await Meal.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    meals = []
  }
  res.render('index', { meals: meals })
})

module.exports = router