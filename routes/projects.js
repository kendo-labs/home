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
	github.repos.getFromOrg({
		org: "kendo-labs",
		type: "public",
		sort: "full_name",
		direction: "asc"
	}, function(err, data) {
		var projectsList = [];
		var i, len;
		
		for (i= 0, len=data.length; i < len; i++) {
			var project = data[i];

			var projectObj = {
				projectName: project.name,
				projectDescription: project.description,
				projectURL: project.html_url,
				lastCommitTime: project.pushed_at,
				lastRelease: "",
				currentVersion: "",
				currentVersionURL: "",
				lastCommitUser: ""
			};

			projectsList.push(projectObj);
		}

		res.json(projectsList);
	});
};