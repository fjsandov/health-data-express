var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var indicatorsSchema = new Schema({
    year: Number,
    number: Number,
    percent: Number,
    lower_confidence_limit: Number,
    upper_confidence_limit: Number,
    age_adjusted_percent: Number, 
    age_adjusted_lower_confidence_limit: Number,
    age_adjusted_upper_confidence_limit: Number
});

var countiesSchema = new Schema({
  name: String,
  code: String,
  state: String,
  indicators: {
    obesity: [indicatorsSchema],
    inactivity: [indicatorsSchema],
    diabetes: [indicatorsSchema]
  }
});

var County = mongoose.model('County', countiesSchema);
module.exports = County;