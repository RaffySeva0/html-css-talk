const logs_table = $("#tblLogs");

function dateTimeFormatter(value, row) {
	return moment(value).format("MM/DD/YYYY hh:mm a");
}

$(document).ready(() => {
	// Load Logs Bootstraptable
	logs_table.bootstrapTable({
		url: "/cms/logs/get_all",
	});
});
