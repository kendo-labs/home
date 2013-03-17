var GitHubAPI = require('github'),
	github = new GitHubAPI({ version: "3.0.0" });

github.authenticate({
	type: "basic",
	username: "bsatrom",
	password: "mrwhite"

});

/*
 * GET projects listing.
 */

exports.list = function(req, res){
	github.user.get({}, function(err, res) {
	    console.log("GOT ERR?", err);
	    console.log("GOT RES?", res);

	    github.repos.getAll({}, function(err, res) {
	        console.log("GOT ERR?", err);
	        console.log("GOT RES?", res);
	    });
	});

  	res.send("respond with a resource");
};