var GitHubAPI = require('github'),
  github = new GitHubAPI({ version: "3.0.0" }),
  q = require('q'),
  everlive = require('./everlive-push');

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

function getProjects() {
  var deferred = q.defer();

  github.repos.getFromOrg({
    org: "kendo-labs",
    type: "public",
    sort: "full_name",
    direction: "asc"
  }, function(err, data) {
    var i, len;

    if (!data) {
      console.log("Error fetching projects: " + err);
      deferred.reject(new Error(err));

      return;
    }

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

    deferred.resolve();
  });

  console.log("Fetching projects...");
  return deferred.promise;
}

function wrapLoop(fn) {
  var i, len;
  var deferred = q.defer();

  for (i= 0, len=projectsList.length; i < len; i++) {
    (function(cntr) {
      return fn(cntr, len, deferred);
    })(i);
  }
  return deferred.promise;
}

function getCommitUsers() {
  var count = 0;

  console.log("Fetching user info...");

  return wrapLoop(function (i, len, deferred) {
    var project = projectsList[i];

    callOpts.repo = project.projectName;

    github.repos.getCommits(callOpts, function(err, data) {
      if (!data) {
        console.log("Error fetching user info: " + err);
        deferred.reject(new Error(err));

        return;
      }

      project.lastCommitUser = data[0].author.login;

      count++;
      if (count === len) {
        deferred.resolve();
      }
    });
  });
}

function getTag() {
  var count = 0;

  console.log("Fetching tags...");

  return wrapLoop(function (i, len, deferred) {
    var project = projectsList[i];

    callOpts.repo = project.projectName;

    github.repos.getTags(callOpts, function(err, data) {
      var commitSha;

      if (!data) {
        console.log("Error fetching tags: " + err);
        deferred.reject(new Error(err));

        return;
      }

      project.currentVersion = data[0].name;
      project.currentVersionURL = data[0].zipball_url;
      project.commitSha = data[0].commit.sha;

      count++;
      if (count === len) {
        deferred.resolve();
      }
    });
  });
}

function getReleaseCommit() {
  var count = 0;

  console.log("Fetching release info...");

  return wrapLoop(function (i, len, deferred) {
    var project = projectsList[i];

    github.repos.getCommit({
      user: 'kendo-labs',
      repo: project.projectName,
      sha: project.commitSha
    }, function(err, data) {
      if (!data) {
        console.log("Error fetching release info: " + err);
        deferred.reject(new Error(err));

        return;
      }

      project.lastRelease = data.commit.author.date;

      count++;
      if (count === len) {
        deferred.resolve();
      }
    });
  });
}

getProjects().then(function() {
  return getCommitUsers();
}).then(function() {
  return getTag();
}).then(function() {
  return getReleaseCommit();
}).then(function() {
  console.log("Completed GitHub Project Fetch. Obtained " + projectsList.length + " projects");

  everlive.saveProjects(projectsList);

}).fail(function(e) {
  console.log("Error retrieving projects: " + e);
});