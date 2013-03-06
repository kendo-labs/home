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

	$.ajax({
		url: "https://api.github.com/orgs/kendo-labs/repos", 
		dataType: "jsonp"
	}).done(function(repos) {
			$.each(repos.data, function(index, repo) {
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

				$.ajax({
					url: commitsURL,
					dataType: "jsonp"
				}).done(function(commits) {
					if (commits.data.length > 0) {
						item.lastCommitUser = commits.data[0].author.login;
					}

					$.ajax({
						url: tagsURL,
						dataType: "jsonp"
					}).done(function(tags) {
						if (tags.data.length > 0) {
							item.currentVersion = tags.data[0].name;
							item.currentVersionURL = tags.data[0].zipball_url;

							$.ajax({
								url: tags.data[0].commit.url,
								dataType: "jsonp"
							}).done(function(commitData) {
								if (commitData.data.commit) {
									item.lastRelease = moment(commitData.data.commit.author.date).format("MMMM Do, YYYY");
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