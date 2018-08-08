/**
 *Instructions:
 * Use fetch method in JavaScript to make an API call to https://jsonplaceholder.typicode.com/posts and console.log the results
 * Extra credit: display the results of the API call on the DOM
 * You must create a deployment on bootcamp-coders for this assignment
 */

var processStatus = function (response) {
	if (response.status === 200 || response.status === 0) {
		return Promise.resolve(response)
	} else {
		return Promise.reject(new Error(response.statusText))
	}
};

var MAX_WAITING_TIME = 5000;// in ms

var parseJson = function (response) {
	return response.json();
};

/* @returns {wrapped Promise} with .resolve/.reject/.catch methods */
// It goes against Promise concept to not have external access to .resolve/.reject methods, but provides more flexibility
var getWrappedPromise = function () {
	var wrappedPromise = {},
		promise = new Promise(function (resolve, reject) {
			wrappedPromise.resolve = resolve;
			wrappedPromise.reject = reject;
		});
	wrappedPromise.then = promise.then.bind(promise);
	wrappedPromise.catch = promise.catch.bind(promise);
	wrappedPromise.promise = promise;// e.g. if you want to provide somewhere only promise, without .resolve/.reject/.catch methods
	return wrappedPromise;
};

/* @returns {wrapped Promise} with .resolve/.reject/.catch methods */
var getWrappedFetch = function () {
	var wrappedPromise = getWrappedPromise();
	var args = Array.prototype.slice.call(arguments);// arguments to Array

	fetch.apply(null, args)// calling original fetch() method
		.then(function (response) {
			wrappedPromise.resolve(response);
		}, function (error) {
			wrappedPromise.reject(error);
		})
		.catch(function (error) {
			wrappedPromise.catch(error);
		});
	return wrappedPromise;
};

/**
 * Fetch JSON by url
 * @param { {
 *  url: {String},
 *  [cacheBusting]: {Boolean}
 * } } params
 * @returns {Promise}
 */
var getJSON = function (params) {
	var wrappedFetch = getWrappedFetch(
		params.cacheBusting ? params.url + '?' + new Date().getTime() : params.url,
		{
			method: 'get',// optional, "GET" is default value
			headers: {
				'Accept': 'application/json'
			}
		});

	var timeoutId = setTimeout(function () {
		wrappedFetch.reject(new Error('Load timeout for resource: ' + params.url));// reject on timeout
	}, MAX_WAITING_TIME);

	return wrappedFetch.promise// getting clear promise from wrapped
		.then(function (response) {
			clearTimeout(timeoutId);
			return response;
		})
		.then(processStatus)
		.then(parseJson);
};

/*--- TEST  --*/
var url = 'https://jsonplaceholder.typicode.com/posts';

var onComplete = function () {
	console.log('I\'m invoked in any case after success/error');
};

getJSON({
	url: url,
	cacheBusting: true
}).then(function (data) {// on success
	console.log('JSON parsed successfully!');
	console.log(data);
	onComplete(data);
}, function (error) {// on reject
	console.error('An error occured!');
	console.error(error.message ? error.message : error);
	onComplete(error);
});