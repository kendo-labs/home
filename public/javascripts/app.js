(function($, kendo, moment) {
  var projectList, projects, ds, template;

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
    url: '/projects',
    type: "GET",
    success: function(repos){
      $.each(repos, function(index, repo) {
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
      $('#dynamicList').addClass('hidden');
      $('#staticList').removeClass('hidden');
    }
  });
}($, kendo, moment));