(function($, kendo, moment) {
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

	$.get("https://api.github.com/orgs/kendo-labs/repos")
		.done(function(repos) {
			$.each(repos, function(index, repo) {
				var tagsURL, commitsURL;
				var item = {
					projectName: repo.name,
					projectURL: repo.html_url,
					lastRelease: "",
					currentVersion: "",
					currentVersionURL: "",
					lastCommitTime: moment(repo.pushed_at, "YYYY-MM-DDTHH:mm:ssZ").fromNow(),
					lastCommitUser: ""
				};

				commitsURL = trimGitHubURL(repo.commits_url);
				tagsURL = trimGitHubURL(repo.tags_url);

				$.get(commitsURL).done(function(commits) {
					if (commits.length > 0) {
						item.lastCommitUser = commits[0].author.login;
					}

					$.get(tagsURL).done(function(tags) {
						if (tags.length > 0) {
							item.currentVersion = tags[0].name;
							item.currentVersionURL = tags[0].zipball_url;

							$.get(tags[0].commit.url).done(function(data) {
								if (data.commit) {
									item.lastRelease = moment(data.commit.author.date).format("MMMM Do, YYYY");
								} else {
									item.lastRelease = "N/A";
								}

								ds.add(item);
							});
						} else {
							item.currentVersion = "N/A";
							item.lastRelease = "N/A";

							ds.add(item);
						}
					});
				});
			});
		}
	);

	function trimGitHubURL(url) {
		return url.slice(0, url.indexOf("{"));
	}

}($, kendo, moment));