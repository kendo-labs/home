var GitHubAPI = require('github'),
	github = new GitHubAPI({ version: "3.0.0" })
	request = require('request'),
	q = require('q');

github.authenticate({
	type: "basic",
	username: "bsatrom",
	password: "mrwhite"

});

var callOpts = {
	user: 'kendo-labs',
	repo: '',
	per_page: 10
};

var projectsList = [];

var baseUrl = "https://api.everlive.com/v1/dmWcmk1OqktZr58u/project"

function getProjects() {
	var deferred = q.defer();

	github.repos.getFromOrg({
		org: "kendo-labs",
		type: "public",
		sort: "full_name",
		direction: "asc"
	}, function(err, data) {
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
					lastCommitUser: "",
					commitSha: ""
				};

				projectsList.push(projectObj);
			}
		}

		deferred.resolve();
	});

	return deferred.promise;
}

function getCommitUsers() {
	var i, len, project;
	var deferred = q.defer();

	for (i= 0, len=projectsList.length; i < len; i++) {
		project = projectsList[i];

		callOpts.repo = project.projectName;
				
		github.repos.getCommits(callOpts, function(err, data, i, project) {
			if (data) {
				project.lastCommitUser = data[0].author.login;
			}

			console.log("Project: " + project.projectName);

			console.log("i = " + i + " len = " + len);
			if (i+1 === len) {
				console.log("resolving");
				deferred.resolve();
			}
		});
	}

	return deferred.promise;
}

function getTag() {
	var i, len, project;
	var deferred = q.defer();
	
	for (i= 0, len=projectsList.length; i < len; i++) {
		project = projectsList[i];

		callOpts.repo = project.projectName;

		github.repos.getTags(callOpts, function(err, data) {
			var commitSha;

			if (data) {
				project.currentVersion = data[0].name;
				project.currentVersionURL = data[0].zipball_url;
				project.commitSha = data[0].commit.sha;
			}

			console.log("TAG: " + project.currentVersion);

			if (i+1 === len) {
				deferred.resolve();
			}
		});
	}

	return deferred.promise;
}

function getReleaseCommit() {
	var i, len, project;
	var deferred = q.defer();
	
	for (i= 0, len=projectsList.length; i < len; i++) {
		project = projectsList[i];

		github.repos.getCommit({
			user: 'kendo-labs',
			repo: project.projectName,
			sha: project.commitSha
		}, function(err, data) {
			if (data) {
				project.lastRelease = data.commit.author.date;
			}

			console.log("Release: " + project.lastRelease);
			if (i+1 === len) {
				deferred.resolve();
			}
		});
	}

	return deferred.promise;
}

getProjects().then(function() {
	return getCommitUsers();
}).then(function() {
	return getTag();
}).then(function() {
	return getReleaseCommit();
}).then(function() {
	console.log("Completed Project Fetch. Obtained " + projectsList.length + " projects");

	for (i = 0; i < projectsList.length; i++) {
		console.log("Last Release: " + projectsList[i].lastRelease);
	}
});