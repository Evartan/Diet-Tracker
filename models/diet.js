const mongoose = require('mongoose')
const Meal = require('./meal')

const dietSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

dietSchema.pre('remove', function(next) {
  Meal.find({ meal: this.id }, (err, meals) => {
    if (err) {
      next(err)
    } else if (meals.length > 0) {
      next(new Error('This diet has meals still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Diet', dietSchema)