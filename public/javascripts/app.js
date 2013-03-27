(function($, kendo, moment) {
  var projectList, projects, ds, template;
  var everliveBaseUrl = "https://api.everlive.com/v1/dmWcmk1OqktZr58u/project";

  projectList = $('#projectsList');
  projects = [];

  ds = new kendo.data.DataSource({ data: projects });
  template = kendo.template($('#projectItemTemplate').html());

  projectList.kendoListView({
    template: template,
    dataSource: ds
  });
  ds.read();

  //Create a Kendo Tooltip
  $("#projectsList").kendoTooltip({
    filter: "a[title]",
    position: "top",
    width: 250
  });

  $.ajax({
    url: everliveBaseUrl,
    type: "GET",
    headers: { "Authorization" : "MasterKey HG8XTSm93vYyg9P42KxyNyhJVGSJT3e4" },
    success: function(repos){
      $.each(repos.Result, function(index, repo) {
        var item = {
          projectName: repo.name,
          projectDescription: repo.description,
          projectURL: repo.url,
          lastCommitTime: moment(repo.lastCommitTime, "YYYY-MM-DDTHH:mm:ssZ").fromNow(),
          lastRelease: moment(repo.lastRelease).format("MMMM Do, YYYY"),
          currentVersion: repo.currentVersion,
          currentVersionURL: repo.currentVersionURL,
          lastCommitUser: repo.lastCommitUser
        };

        ds.add(item);
      });
    },
    error: function(error){
      // Change to place this message in the list, but not in the ds
      var item = {
        projectName: "Error retrieving project list. Please refresh to try again",
        projectDescription: "",
        projectURL: "",
        lastCommitTime: "",
        lastRelease: "",
        currentVersion: "",
        currentVersionURL: "",
        lastCommitUser: ""
      };

      ds.add(item);
    }
  });
}($, kendo, moment));