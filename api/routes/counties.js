module.exports = function(app) {
  var countyActions = require('../controllers/counties');
  
  app.route('/counties')
  	.get(countyActions.list);

  app.route('/counties/update_database/')
  	.get(countyActions.updateDatabase);

  app.route('/counties/:code')
  	.get(countyActions.show);

};