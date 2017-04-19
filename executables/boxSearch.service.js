tatool.factory('boxSearch', [ 'executableUtils', 'stimulusServiceFactory', 'inputServiceFactory', 'dbUtils',
  function (executableUtils, stimulusServiceFactory, inputServiceFactory, dbUtils) {  

    var BoxSearch = executableUtils.createExecutable();

    BoxSearch.prototype.init = function() {
	var promise = executableUtils.createPromise();
	
	this.counter = 0;
	this.stimulusService = stimulusServiceFactory.createService(this.stimuliPath);
	this.inputService = inputServiceFactory.createService(this.stimuliPath);

	//resolve promise when reading successful and reject when an error occurred
	var self = this;
	executableUtils.getCSVResource(this.stimuliFile, true, this.stimuliPath).then(
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
    BoxSearch.prototype.createStimulus = function() {
    	var stimulus = executableUtils.getNext(this.stimuliList, this.counter);
    	this.stimulusService.set(stimulus);
    	this.counter++;

    	this.trial={};
    	this.trial.stimulusType = stimulus.stimulusType;
    	this.trial.stimulusValue = stimulus.stimulusValue;
    	this.trial.correctResponse = stimulus.correctResponse;
    };

    BoxSearch.prototype.processResponse = function(response) {
      this.trial.reactionTime = this.endTime - this.startTime; 
      this.trial.givenResponse = response;
      if (this.trial.correctResponse == this.trial.givenResponse) {
        this.trial.score = 1;
      } else {
        this.trial.score = 0;
      }
      dbUtils.saveTrial(this.trial).then(executableUtils.stop);
    };
    /*BoxSearch.prototype.stopExecution = function() {
      executableUtils.stop();
    };*/

    return BoxSearch;
  }]);
