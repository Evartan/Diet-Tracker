const express = require('express')
const router = express.Router()
const Diet = require('../models/diet')
const Meal = require('../models/meal')

// All Diets Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const diets = await Diet.find(searchOptions)
    res.render('diets/index', {
      diets: diets,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Diet Route
router.get('/new', (req, res) => {
  res.render('diets/new', { diet: new Diet() })
})

// Create Diet Route
router.post('/', async (req, res) => {
  const diet = new Diet({
    name: req.body.name
  })
  try {
    const newDiet = await diet.save()
    res.redirect(`diets/${newDiet.id}`)
  } catch {
    res.render('diets/new', {
      diet: diet,
      errorMessage: 'Error creating Diet'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const diet = await Diet.findById(req.params.id)
    const meals = await Meal.find({ meal: meal.id }).limit(6).exec()
    res.render('meals/show', {
      meal: meal,
      mealsByDiet: meals
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const diet = await Diet.findById(req.params.id)
    res.render('diets/edit', { diet: diet })
  } catch {
    res.redirect('/diets')
  }
})

router.put('/:id', async (req, res) => {
  let diet
  try {
    diet = await Diet.findById(req.params.id)
    diet.name = req.body.name
    await diet.save()
    res.redirect(`/diets/${diet.id}`)
  } catch {
    if (diet == null) {
      res.redirect('/')
    } else {
      res.render('diets/edit', {
        diet: diet,
        errorMessage: 'Error updating Diet'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let diet
  try {
    diet = await Diet.findById(req.params.id)
    await diet.remove()
    res.redirect('/diets')
  } catch {
    if (diet == null) {
      res.redirect('/')
    } else {
      res.redirect(`/diets/${diet.id}`)
    }
  }
})

module.exports = router