/**
 * ScoreSystem.js -- General scoring system for multiple users and scoring functions.
 * 
 * @author	Rolf Lindén
 * @email	rolind@utu.fi
 * @licence	MIT licence
 */

ScoreFunctions = {
	avg: function(arr) {

			if(arr.length > 0) {
				var sum = 0;
				for(var i=0; i<arr.length; i++) {
					sum += arr[i];
				}

				var avg = sum/arr.length;
				avg += 0.5; //for proper rounding
				avg += '';
				if(avg.indexOf('.') !== -1) {
					avg = avg.slice(0, avg.indexOf('.'));
				}

				return avg;
			}
			return 0;
	},
	avgLast10: function(v) {
		result = 0;
		for (var i = Math.max(0, v.length - 10); i < v.length; ++i) result += v[i];
		return result / (v.length - Math.max(0, v.length - 10));
	},
	mean: function(v) {
		if (v.length === 0) return 0;
		
		result = 0;
		for (var i = 0; i < v.length; ++i) result += v[i];
		return result / v.length;
	},
	total: function(v) {
		result = 0;
		for (var i = 0; i < v.length; ++i) result += v[i];
		return result;
	}
}

function ScoreSystem(config) {

	this.scoref = ScoreFunctions['avgLast10'];

	this.users = {};

	for (var item in config) this[item] = config[item];
}

ScoreSystem.prototype.addUser = function(userID) {
	this.users[userID] = {
		alias: userID,	// Name of the user.
		results: [] 	// Stored results for the user.
	};
	
	return this;
}

ScoreSystem.prototype.setAlias = function(userID, alias) {
	if (typeof(this.users[userID]) === 'undefined') throw('No such userID.');
	this.users[userID].alias = alias;
	
	return this;
}

ScoreSystem.prototype.pushResult = function(userID, result) {
	if (typeof(this.users[userID]) === 'undefined') throw('No such userID.');
	this.users[userID].results.push(result);
	
	return this;
}

ScoreSystem.prototype.getScore = function(userID) {
	if (typeof(this.users[userID]) === 'undefined') throw('No such userID.');
	return this.scoref(this.getResults(userID));
}

ScoreSystem.prototype.getResults = function(userID) {
	if (typeof(this.users[userID]) === 'undefined') throw('No such userID.');
	return this.users[userID].results;
}

ScoreSystem.prototype.clearResults = function(userID) {
	if (typeof(this.users[userID]) === 'undefined') throw('No such userID.');
	this.users[userID].results = [];
	return this;
}

ScoreSystem.prototype.getAllScores = function(sortFunction) {
	var keyValue = [];
	
	var sortf = typeof(sortFunction) === 'function' ? sortFunction : function(a, b) { return b.value - a.value };
	
	for (var userID in this.users) {
		keyValue.push(
			{
				key: userID,
				value: this.getScore(userID)
			}
		);
	}
	
	keyValue.sort(sortf);
	
	return keyValue;
}



ScoreSystem.prototype.getRank = function(userID, sortFunction) {
	var keyValue = this.getAllScores(sorfFunction);
	
	var rank = null;
	for (var item = 0; item < keyValue.length; ++item) if (keyValue[item].key === userID) return item;
}


ScoreSystem.prototype.getTopN = function(n, sortFunction) {
	var keyValue = this.getAllScores(sorfFunction);
	return keyValue.splice(0, n);
}
