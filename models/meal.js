const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  consumeDate: {
    type: Date,
    required: true
  },
  calCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  mealImage: {
    type: Buffer,
    required: true
  },
  mealImageType: {
    type: String,
    required: true
  },
  diet: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Diet'
  }
})

mealSchema.virtual('mealImagePath').get(function() {
  if (this.mealImage != null && this.mealImageType != null) {
    return `data:${this.mealImageType};charset=utf-8;base64,${this.mealImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Meal', mealSchema)