tatool.factory('boxSearch', [ 'executableUtils',
  function (executableUtils) {  

    var BoxSearch = executableUtils.createExecutable();

    BoxSearch.prototype.init = function() {
	var promise = executableUtils.createPromise();
	
	//manually define resource for stimuliFile		
	var stimuliFile ={
		project: {
			name: 'boxSearch',
			access: 'public'
		},
		resourceType: 'stimuli',
		resourceName: 'boxSearch.csv'
	};

	//manually define path for stimuliPath
	var stimuliPath = {
		project: {
			name: 'boxSearch',
			access: 'public'
		},
		resourceType: 'stimuli'
	};

	//read stimuliFile and all image stimuli
	//resolve promise when reading successful and reject when an error occurred
	var self = this;
	executableUtils.getCSVResource(stimuliFile, true, stimuliPath).then(
		function(list) {
			self.stimuliList = list;
			console.log('stimuliList Length: ', self.stimuliList.length);

			promise.resolve();
		}, function(error) {
			promise.reject(error);
		});

	return promise;
    };

    // our custom methods go here
    BoxSearch.prototype.stopExecution = function() {
      executableUtils.stop();
    };

    return BoxSearch;
  }]);
