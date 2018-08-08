/**
 *Instructions:
 * Use fetch method in JavaScript to make an API call to https://jsonplaceholder.typicode.com/posts and console.log the results
 * Extra credit: display the results of the API call on the DOM
 * You must create a deployment on bootcamp-coders for this assignment
 */

fetch('https://jsonplaceholder.typicode.com/posts')
	.then(
		function(response) {
			if (response.status !==200) {
				console.log('Dont quite know what to say here' + response.status);
				return;
			}

			//examine the text in the response
			response.json().then(function(data) {
				console.log(data);
			});
		}
	)
	.catch(function(err) {
		console.log('Fetch Error :-S', err);
});