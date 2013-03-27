(function() {
  var request = require('request');

  var everliveBaseUrl = "https://api.everlive.com/v1/dmWcmk1OqktZr58u/project";
  var projectCtr = [];
  var projectCtr;

  function getProjectObject(project) {
    return {
      name: project.projectName,
      description: project.projectDescription,
      url: project.projectURL,
      lastCommitTime: project.lastCommitTime,
      lastRelease: project.lastRelease,
      currentVersion: project.currentVersion,
      currentVersionURL: project.currentVersionURL,
      lastCommitUser: project.lastCommitUser
    };
  }

  function getProjects(callback) {
    request({ 
        url: everliveBaseUrl,
        headers: { "Authorization" : "MasterKey HG8XTSm93vYyg9P42KxyNyhJVGSJT3e4" },
          json: true
      }, function(error, response, body) {
        if (error) {
          console.log("Error fetching project list: " + error);
          return;       
        }

        console.log("Retreived projects. Count: " + body.Count);

        callback(body.Result);
      });
  }

  function saveProject(url, method, project, callback) {
    request({
      url: url,
      headers: { 
        "Authorization" : "MasterKey HG8XTSm93vYyg9P42KxyNyhJVGSJT3e4",
        "Content-Type" : "application/json" },
      method: method,
      body: JSON.stringify(project),
      json: true
    }, function(error, response, body) {
      callback(error, response, body);
    });
  }

  function createOrUpdateProject(savedList, project) {
      // Look for the project in the savedList object. If it doesn't exist, this is an update. 
      // Otherwise, create a new record.
      var match = false;
      var i, len;

      for (i = 0, len = savedList.length; i < len; i++) {
        if (project.projectName === savedList[i].name) {
          match = true;
          break;
        }
      }

      if (match) {
        // Update project
        console.log("Project '" + project.projectName + "' already exists. Updating attributes...");

        var updatedProject = getProjectObject(project);

        saveProject(everliveBaseUrl + "/" + savedList[i].Id, "PUT", updatedProject, function(error, response, body) {
          if (error) {
            console.log("Error updating project '" + project.projectName + "' with error '" + error);
          } else {
            if (body.Result === 1) { 
              console.log("Updated project '" + project.projectName + "'");
            }
          }
        });
      } else {
        // New Project
        console.log("Project '" + project.projectName + "' is new. Saving new entry...");

        var newProject = getProjectObject(project);

        saveProject(everliveBaseUrl, "POST", newProject, function(error, response, body) {
          if (error) {
            console.log("Error saving project '" + project.projectName + "' with error '" + error);
          } else {
            console.log("Saved project '" + project.projectName + "' with ID {" + body.Result.Id + "}");
          }
        });
      }
  }

  function saveProjects(list) {
    console.log("Saving projects. (Count: " + list.length + ")");

    getProjects(function(savedList) {
      var i, len;

      for (i = 0, len = list.length; i < len; i++) {
        createOrUpdateProject(savedList, list[i]);
      }

    });
  }

  exports.saveProjects = saveProjects;
}());