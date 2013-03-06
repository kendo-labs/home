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
	
	//Create a Kendo Tooltip
	$("#projectsList").kendoTooltip({ 
		filter: "a[title]",
		position: "top",
		width: 250
	});

	$.ajax({
		url: "https://api.github.com/orgs/kendo-labs/repos" + appendAuth(),
		dataType: "jsonp"
	}).done(function(repos) {
			if (repos.message) {
				return;
			}

			$.each(repos.data, function(index, repo) {
				var tagsURL, commitsURL;
				var item = {
					projectName: repo.name,
					projectDescription: repo.description,
					projectURL: repo.html_url,
					lastCommitTime: moment(repo.pushed_at, "YYYY-MM-DDTHH:mm:ssZ").fromNow(),
					lastRelease: "",
					currentVersion: "",
					currentVersionURL: "",
					lastCommitUser: ""
				};

				commitsURL = trimGitHubURL(repo.commits_url);
				tagsURL = trimGitHubURL(repo.tags_url);

				$.ajax({
					url: commitsURL + appendAuth(),
					dataType: "jsonp"
				}).done(function(commits) {
					if (commits.data.length > 0) {
						item.lastCommitUser = commits.data[0].author.login;
					}

					$.ajax({
						url: tagsURL + appendAuth(),
						dataType: "jsonp"
					}).done(function(tags) {
						if (tags.data.length > 0) {
							item.currentVersion = tags.data[0].name;
							item.currentVersionURL = tags.data[0].zipball_url;

							$.ajax({
								url: tags.data[0].commit.url + appendAuth(),
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

	function appendAuth() {
		return "?client_id=99037c7dfd5c47cdd24d&client_secret=d2a6d2c157ae1ef17e6c6876f4edb3b1da7f0d15";
	}

}($, kendo, moment));