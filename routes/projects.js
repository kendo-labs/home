var GitHubAPI = require('github'),
	github = new GitHubAPI({ version: "3.0.0" });

var callOpts = {
	user: 'kendo-labs',
	repo: '',
	per_page: 10
};

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

		if (data) {
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
		}

		res.json(projectsList);
	});
};

exports.latestCommit = function(req, res) {
	callOpts.repo = req.query['project'];


	github.repos.getCommits(callOpts, function(err, data) {
		if (data) {
			res.json({ lastCommitUser: data[0].author.login });
		} else {
			res.json([]);
		}
	});
};

exports.latestRelease = function(req, res) {
	var response;

	callOpts.repo = req.query['project'];

	github.repos.getTags(callOpts, function(err, data) {
		if (data) {
			response = {
				currentVersion: data[0].name,
				currentVersionURL: data[0].zipball_url,
				commitSha: data[0].commit.sha
			};
		} else {
			response = { msg: "no tags found" };
		}

		res.json(response);
	});
};

exports.releaseCommit = function(req, res) {
	var sha = req.query['sha'],
		project = req.query['project'];

	github.repos.getCommit({
		user: 'kendo-labs',
		repo: project,
		sha: sha
	}, function(err, data) {
		if (date) {
			res.json({ lastRelease: data.commit.author.date });
		} else {
			res.json([]);
		}
	});
};