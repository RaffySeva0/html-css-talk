const data = [
	{
		name: "John Doe",
		email: "johndoe@mail.com",
		date_subscribed: "09/11/20",
	},
];
const _subscribers_table = $("#tblSubscribers");

function actionFormatter(value, row, index) {

	let subscribeBtn = '';

	if ( row.unsubscribed == "1" ) {
		// If person is unsubscribed
		subscribeBtn = `<button class="btn btn-success btn-resubcribe">\
        					<i class="far fa-plus-square"></i> <span class="hidden-sm hidden-xs">Resubscribe</span>\
      					</button>`;
	} else {
		// Else if person is already subscribed
		subscribeBtn = `<button class="btn btn-danger btn-unsubcribe">\
        					<i class="far fa-trash-alt"></i> <span class="hidden-sm hidden-xs">Unsubscribe</span>\
      					</button>`;
	}

	return [
		`<div class="btn-group" role="grid">\
      		${subscribeBtn}
    	</div>`,
	].join("");
}

function subscriberStatusFormatter(value, row, index) {
	if (value != "1") {
		return "Subscribed";
	} else {
		return "Unsubscribed";
	}
}

window.operateEvents = {
	"click .btn-unsubcribe": function (e, value, row) {
		$("#unsubscribeModal").data('subscriber-email', row.email);
		$("#unsubscribeModal").data('subsciber-id', row.subscriber_id).modal("show");
	},
	"click .btn-resubcribe": function (e, value, row) {
		$("#resubscribeModal").data('subscriber-email', row.email);
		$("#resubscribeModal").data('subsciber-id', row.subscriber_id).modal("show");
	},
};

$(document).ready(() => {
	// $("#tblSubscribers").bootstrapTable({ data: data });
	_subscribers_table.bootstrapTable({
		url: "/cms/subscribers/get_all"
	});

	// Unsubscribe
	$("#unsubscribeModal #btnUnsubscribe").click((e)=>{
		$.ajax({
			data: {
				subscriber_id: $("#unsubscribeModal").data('subsciber-id'),
				email: $("#unsubscribeModal").data('subscriber-email')
			},
			dataType: "json",
			type: "post",
			url: "subscribers/unsubscribe",
			beforeSend: function() {
				Swal.fire({
		      title: "Please wait",
		      showConfirmButton: false,
		      allowEscapeKey: false,
		      allowOutsideClick: true,
		      onOpen: () => {
		        Swal.showLoading();
		      },
		    });
			},
			success: function (data) {
				$("#unsubscribeModal").modal("hide");
				if (data != "fail") {
					Swal.fire({
						icon: "success",
						text: "Successfully unsubscribed subscriber.",
						timer: 1200,
					}).then((res) => {
						_subscribers_table.bootstrapTable("refresh", { silent: true });
					});
				} else {
					Swal.fire({
						icon: "error",
						text: "Problem in unsubscribing selected subscriber.",
						timer: 1200,
					}).then((res) => {
						_subscribers_table.bootstrapTable("refresh", { silent: true });
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// Resubscribe
	$("#resubscribeModal #btnResubscribe").click((e)=>{
		$.ajax({
			data: {
				subscriber_id: $("#resubscribeModal").data('subsciber-id'),
				email: $("#resubscribeModal").data('subscriber-email')
			},
			dataType: "json",
			type: "post",
			url: "subscribers/resubscribe",
			beforeSend: function() {
				Swal.fire({
		      title: "Please wait",
		      showConfirmButton: false,
		      allowEscapeKey: false,
		      allowOutsideClick: true,
		      onOpen: () => {
		        Swal.showLoading();
		      },
		    });
			},
			success: function (data) {
				$("#resubscribeModal").modal("hide");
				if (data != "fail") {
					Swal.fire({
						icon: "success",
						text: "Successfully resubscribed subscriber.",
						timer: 1200,
					}).then((res) => {
						_subscribers_table.bootstrapTable("refresh", { silent: true });
					});
				} else {
					Swal.fire({
						icon: "error",
						text: "Problem in resubscribing selected subscriber.",
						timer: 1200,
					}).then((res) => {
						_subscribers_table.bootstrapTable("refresh", { silent: true });
					});
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});
});
