(function($, kendo) {
	var projectsList, projects, ds, template;

	projectList = $('#projectsList');
	projects = [];

	ds = new kendo.data.DataSource({ data: projects });
	template = kendo.template($('#projectItemTemplate').html());

	projectList.kendoListView({
		template: template,
		dataSource: ds
	});
	ds.read();

	$.get("https://api.github.com/orgs/kendo-labs/repos").done(function(repos) {
		$.each(repos, function(index, repo) {
			var tagsURL, commitsURL;
			var item = {
				projectName: repo.name,
				projectURL: repo.html_url,
				lastRelease: "",
				currentVersion: "",
				lastCommitTime: repo.pushed_at,
				lastCommitUser: ""
			};

			tagsURL = repo.tags_url;
			commitsURL = repo.commits_url;

			ds.add(item);
		});
	});

}($, kendo));