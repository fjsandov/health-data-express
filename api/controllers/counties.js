var mongoose = require('mongoose');
var County = mongoose.model('County');

exports.list = function(request, response) {
  County.find({}, 'name code state', (error, counties) => {
    if(error) {
    	response.send(error);
    }
    else {
    	response.json(counties);
    }
  });
};

exports.show = function(request, response) {
	var code = request.params.code;
	County.findOne({'code': code}, (error, county) => {
		if(error) {
	    	response.send(error);
	    }
	    if(county) {
	    	response.json(county);
	    }
	    else {
	    	response.status(404).json('County with code '+code+' not found.');
	    }
	});
}

exports.updateDatabase = function(request, response) {
	County.remove({}, function(err) { 
		if(!err) {
			Promise.resolve()
				.then(() => indicatorXlsxLoad('obesity',   'OB_PREV_ALL_STATES.xlsx'))
				.then(() => indicatorXlsxLoad('inactivity', 'LTPIA_PREV_ALL_STATES.xlsx'))
				.then(() => indicatorXlsxLoad('diabetes',   'DM_PREV_ALL_STATES.xlsx'))
				.then(() => response.json('Database updated.'))
				.catch((error) => response.status(500).json('Error ocurred while updating the database.'));
		}
	});
}

/*
	All xlsx files share the same structure and each is about one indicator.
	The first two rows are headers and then the data is structured by column index of each cell in the way explained in the next paragraph:

	0: State
	1: FIPS Codes
	2: County

	then 7 indicators per year ordered this way:

	3 to 9: 2004 indicators info
	10 to 16: 2005 indicators info
	...
	[7x + 3] to [(7x + 3) + 6]: [2004 + x] indicators info
	...
	13 to 21: 2013 indicators info

	All the indicators in the xlsx are the ones in which x moves between 0 and 9 (years between 2004 and 2013).
*/
var indicatorXlsxLoad = function(indicatorName, xlsxFilename, callback) {
	console.log('loading ' + indicatorName +  ' data...');
	var xlsReader = require('excel');
	var filePath = './seed/' + xlsxFilename;
	return new Promise(function(resolve, reject) {
		xlsReader(filePath, function(error, data) {
			if(error) {
				reject(error);
			}
			var promises = [];
			// i starts in 2 because the first 2 rows are headers (indexes 0 and 1)
			for(var i = 2; i < data.length; i++) {
				var row = data[i];
				var countyJson = {
					state: row[0],
					code: row[1],
					name: row[2],
					indicators: {}
				};

				var indicatorValue = function(cellContent) {
					return (isNaN(cellContent) || cellContent.trim() === "") ? -1 : parseFloat(cellContent).toFixed(2);
				};
				var indicators = [];
				for(var x=0; x <= 9; x++) {
					var firstCellIndex = 7*x + 3;	
					var indicatorJson = {
						year: 2004 + x,
					    number: indicatorValue(row[firstCellIndex]),
					    percent: indicatorValue(row[firstCellIndex + 1]),
					    lower_confidence_limit: indicatorValue(row[firstCellIndex + 2]),
					    upper_confidence_limit: indicatorValue(row[firstCellIndex + 3]),
					    age_adjusted_percent: indicatorValue(row[firstCellIndex + 4]),
					    age_adjusted_lower_confidence_limit: indicatorValue(row[firstCellIndex + 5]),
					    age_adjusted_upper_confidence_limit: indicatorValue(row[firstCellIndex + 6])					
					};
					indicators.push(indicatorJson);
				}
				countyJson['indicators'][indicatorName] = indicators;

				var persistCounty = function(json, targetIndicator) {
					return new Promise(function(resolveQuery, rejectQuery) {
						County.findOne({code: json['code']}, function(error, county) {
							if(error) {
								rejectQuery(error);
							}
							else {
								if(county) {
									var countyIndicators = county['indicators'];
									countyIndicators[indicatorName] = json['indicators'][targetIndicator];						
									county['indicators'] = countyIndicators;
								}
								else {
									county = new County(json);
								}
								county.save(function(err) {
									if (err) {
										rejectQuery(err);
									}
									else {
										resolveQuery({});
									}
								});
							}
						});
					});
				};

				var promise = persistCounty(countyJson, indicatorName);
				promises.push(promise);
			}

			Promise.all(promises).then(values => {
				resolve({});
			});
		});
	});

	
};