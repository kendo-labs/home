var request = require('request');
var everliveBaseUrl = "https://api.everlive.com/v1/dmWcmk1OqktZr58u/project";

function getProjects(callback) {
  request({ 
      url: everliveBaseUrl,
      headers: { "Authorization" : "MasterKey HG8XTSm93vYyg9P42KxyNyhJVGSJT3e4" },
        json: true
    }, function(error, response, body) {
      if (error) {
        console.log("Error fetching project list on client request: " + error);
        return;       
      }

      console.log("Retreived projects on client request. Count: " + body.Count);

      callback(body.Result);
    });
}


/*
 * GET projects list.
 */

exports.list = function(req, res){
  getProjects(function(list) {
    res.json(list);
  });
};