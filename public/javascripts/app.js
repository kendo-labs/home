(function($, kendo, moment) {
	var projectList, projects, ds, template;

	projectList = $('#projectsList');
	projects = [];

	ds = new kendo.data.DataSource({ data: projects });
	template = kendo.template($('#projectItemTemplate').html());

	/*projectList.kendoListView({
		template: template,
		dataSource: ds
	});
	ds.read();*/

	//Create a Kendo Tooltip
	$("#projectsList").kendoTooltip({
		filter: "a[title]",
		position: "top",
		width: 250
	});

	/*$.ajax("/projects")
		.done(function(repos) {
			$.each(repos, function(index, repo) {
				var tagsURL, commitsURL;
				var item = {
					projectName: repo.projectName,
					projectDescription: repo.projectDescription,
					projectURL: repo.projectURL,
					lastCommitTime: moment(repo.lastCommitTime, "YYYY-MM-DDTHH:mm:ssZ").fromNow(),
					lastRelease: "N/A",
					currentVersion: "N/A",
					currentVersionURL: "N/A",
					lastCommitUser: "N/A"
				};

				$.ajax("/latestCommit?project=" + item.projectName).done(function (commit) {
					item.lastCommitUser = commit.lastCommitUser;

					$.ajax("/latestRelease?project=" + item.projectName).done(function (tag) {
						if (!tag.msg) {
							item.currentVersion = tag.currentVersion;
							item.currentVersionURL = tag.currentVersionURL;

							$.ajax("/releaseCommit?project=" + item.projectName + "&sha=" + tag.commitSha).done(function(commit) {
								item.lastRelease = moment(commit.lastRelease).format("MMMM Do, YYYY");

								ds.add(item);
							});
						} else {
							ds.add(item);
						}
					});
				});
			});
		});*/
}($, kendo, moment));