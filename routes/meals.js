const express = require('express')
const router = express.Router()
const Meal = require('../models/meal')
const Diet = require('../models/diet')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Meals Route
router.get('/', async (req, res) => {
  let query = Meal.find()
  if (req.query.label != null && req.query.label != '') {
    query = query.regex('label', new RegExp(req.query.label, 'i'))
  }
  if (req.query.consumededBefore != null && req.query.consumededBefore != '') {
    query = query.lte('consumeDate', req.query.consumedBefore)
  }
  if (req.query.consumedAfter != null && req.query.consumedAfter != '') {
    query = query.gte('consumeDate', req.query.consumedAfter)
  }
  try {
    const meals = await query.exec()
    res.render('meals/index', {
      meals: meals,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Meal Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Meal())
})

// Create Meal Route
router.post('/', async (req, res) => {
  const meal = new Meal({
    label: req.body.label,
    diet: req.body.diet,
    consumeDate: new Date(req.body.consumeDate),
    calCount: req.body.calCount,
    description: req.body.description
  })
  saveImage(meal, req.body.image)

  try {
    const newMeal = await meal.save()
    res.redirect(`meals/${newMeal.id}`)
  } catch {
    renderNewPage(res, meal, true)
  }
})

// Show Meal Route
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
                           .populate('diet')
                           .exec()
    res.render('meals/show', { meal: meal })
  } catch {
    res.redirect('/')
  }
})

// Edit Meal Route
router.get('/:id/edit', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id)
    renderEditPage(res, meal)
  } catch {
    res.redirect('/')
  }
})

// Update Meal Route
router.put('/:id', async (req, res) => {
  let meal

  try {
    meal = await Meal.findById(req.params.id)
    meal.label = req.body.label
    meal.diet = req.body.diet
    meal.consumeDate = new Date(req.body.consumeDate)
    meal.calCount = req.body.calCount
    meal.description = req.body.description
    if (req.body.image != null && req.body.image !== '') {
      saveImage(meal, req.body.image)
    }
    await meal.save()
    res.redirect(`/meals/${meal.id}`)
  } catch {
    if (meal != null) {
      renderEditPage(res, meal, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Meal Page
router.delete('/:id', async (req, res) => {
  let meal
  try {
    meal = await Meal.findById(req.params.id)
    await meal.remove()
    res.redirect('/meals')
  } catch {
    if (meal != null) {
      res.render('meals/show', {
        meal: meal,
        errorMessage: 'Could not remove meal'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, meal, hasError = false) {
  renderFormPage(res, meal, 'new', hasError)
}

async function renderEditPage(res, meal, hasError = false) {
  renderFormPage(res, meal, 'edit', hasError)
}

async function renderFormPage(res, meal, form, hasError = false) {
  try {
    const diets = await Diet.find({})
    const params = {
      diets: diets,
      meal: meal
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Meal'
      } else {
        params.errorMessage = 'Error Creating Meal'
      }
    }
    res.render(`meals/${form}`, params)
  } catch {
    res.redirect('/meals')
  }
}

function saveImage(meal, imageEncoded) {
  if (imageEncoded == null) return
  const image = JSON.parse(imageEncoded)
  if (image != null && imageMimeTypes.includes(image.type)) {
    meal.mealImage = new Buffer.from(image.data, 'base64')
    meal.mealImageType = image.type
  }
}

module.exports = router