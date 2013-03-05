(function($, kendo) {
	var projectsList, projects, ds, template;

	projectList = $('#projectsList');
	projects = [ {
			projectName: "angular-kendo",
			projectURL: "",
			lastRelease: "",
			currentVersion: "",
			lastCommitTime: "",
			lastCommitUser: "bsatrom"
		},
		{
			projectName: "breeze-kendo",
			projectURL: "",
			lastRelease: "",
			currentVersion: "",
			lastCommitTime: "",
			lastCommitUser: "derickbailey"
		}
	];
	ds = new kendo.data.DataSource({ data: projects });
	template = kendo.template($('#projectItemTemplate').html());

	projectList.kendoListView({
		template: template,
		dataSource: ds
	});
	ds.read();

}($, kendo));