// CONSTANTS
// const _current_events_table = $("#tblAttendeesCurrentEvents");
// const _past_events_table = $("#tblAttendeesPastEvents");
const _attendees_table = $("#tblAttendees1");
const _view_watched_videos_table = $("#viewAttendeeInfo #tblViewWatchedVideos");
// VARIABLES

// FUNCTIONS
function actionFormatter(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
			<button class="btn btn-info btn-view-attendee">\
       		 <i class="far fa-question-circle"></i> <span class="hidden-sm hidden-xs">View</span>\
	  		</button>
	  		<button class="btn btn-warning btn-edit-attendee text-white">\
        	 <i class="far fa-edit"></i> <span class="hidden-sm hidden-xs">Edit</span>\
      		</button>
      		<button class="btn btn-danger btn-delete-attendee">\
        	 <i class="far fa-trash-alt"></i> <span class="hidden-sm hidden-xs">Delete</span>\
      		</button>
    	</div>`,
	].join("");
}

function eventDateTimeFormatter(value, row) {
	return moment(value).format("MM/DD/YYYY hh:mm a");
}

function proofStatusFormatter(value, row) {
	let ret = "";
	if (value != "") {
		ret = `<div class="text-center">
						<i class="far fa-check-circle text-success proof-of-employment-status"></i>
					</div>`;
	} else {
		ret = `<div class="text-center">
						<i class="far fa-times-circle text-danger proof-of-employment-status"></i>				
					</div>`;
	}
	return ret;
}

function poeStatusFormatter(value, row) {
	if (value == "")
		return "N/A";
	return value;
}

function nameFormatter(value,row) {

	return row.first_name + ' ' + row.middle_initial + ' ' + row.last_name;
}	

function numberWithCommas(x) {
	x = parseFloat(x).toFixed(2);
	var parts = x.toString().split(".");
	var count = parts.length;

	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}

function validateForm(formId) {
	// formId is modal id
	let result = true;
	let message = "";
	let res_obj = {};

	let required_fields = $(`#${formId} .required-field`);

	$.each(required_fields, (i, input) => {
		//Loop all required fields
		let form_group = $(input).parents(".form-group");
		if (!$(input).hasClass("bootstrap-select")) {
			if (input.value.trim().length == 0) {
				$(input).addClass("is-invalid");
				// input.focus();
				result = false;
				message = "Please complete required fields";
			} else {
				$(input).removeClass("is-invalid");
			}
		}
	});

	res_obj.result = result;
	res_obj.message = message;

	return res_obj;
}

// EVENT LISTENERS
window.operateEvents = {
	"click .btn-view-attendee": function (e, value, row) {
		$("#viewAttendeeInfo").modal("show");
		$("#viewAttendeeInfo #viewAttendeeName").text(row.first_name + ' ' + row.middle_initial + ' ' + row.last_name);
		$("#viewAttendeeInfo #viewAttendeeEmail").text(row.email_address);
		$("#viewAttendeeInfo #viewAttendeeContact").text(row.contact_number);
		$("#viewAttendeeInfo #viewAttendeeBirthday").text(row.birthdate);
		$("#viewAttendeeInfo #viewAttendeeEmployment").text(row.employment);
		$("#viewAttendeeInfo #viewAttendeeEmploymentDetails").text(row.school);
		$("#viewAttendeeInfo #viewAttendeeAffliations").text(row.affiliation);
		$("#viewAttendeeInfo #viewAttendeeSource").text(row.source);

		_view_watched_videos_table.bootstrapTable('destroy');
		_view_watched_videos_table.bootstrapTable({
			url: "/cms/attendees/get_videos_watched",
			queryParams: function(p){
				return {
					attendee_id: row.attendee_id
				}
			}
		});
	},
	"click .btn-edit-attendee": function (e, value, row) {
		$("#editAttendeeInfo").data("attendee-id", row.attendee_id).modal("show");
		$("#editAttendeeInfo #firstName").val(row.first_name);
		$("#editAttendeeInfo #middleName").val(row.middle_initial);
		$("#editAttendeeInfo #lastName").val(row.last_name);
		$("#editAttendeeInfo #attendeeEmail").val(row.email_address);
		$("#editAttendeeInfo #attendeeContact").val(row.contact_number);
		$("#editAttendeeInfo #attendeeBirthday").val(row.birthdate);
		$("#editAttendeeInfo #attendeeEmployment").val(row.employment);
		$("#editAttendeeInfo #attendeeEmploymentDetails").val(row.school);
		$("#editAttendeeInfo #attendeeAffiliations").val(row.affiliation);
		$("#editAttendeeInfo #attendeeSource").val(row.source);
	},
	"click .btn-delete-attendee": function (e, value, row) {
		$("#deleteAttendee").data("event-title", $("#viewAttendees").data("event-title"));
		$("#deleteAttendee").data("first-name", row.first_name);
		$("#deleteAttendee").data("last-name", row.last_name);
		$("#deleteAttendee").data("attendee-id", row.attendee_id).modal("show");
	},
	"click .btn-approve-attendee": function (e, value, row) {
		$("#approveAttendee").data("event-title", $("#viewAttendees").data("event-title"));
		$("#approveAttendee").data("attendee-name", row.attendee_name);
		$("#approveAttendee").data("attendee-id", row.attendee_id).modal("show");
	},
	"click .btn-disapprove-attendee": function (e, value, row) {
		$("#disapproveAttendee").data("event-title", $("#viewAttendees").data("event-title"));
		$("#disapproveAttendee").data("attendee-name", row.attendee_name);
		$("#disapproveAttendee").data("attendee-id", row.attendee_id).modal("show");
	},
	"click .btn-send-zoom-link": function (e, value, row) {
		$("#sendZoomLink").data("event-title", $("#viewAttendees").data("event-title"));
		$("#sendZoomLink").data("event-id", row.event_id);
		$("#sendZoomLink").data("attendee-name", row.attendee_name);
		$("#sendZoomLink").data("attendee-email", row.attendee_email);
		$("#sendZoomLink").data("attendee-id", row.attendee_id).modal("show");
	},
};

$(document).ready(() => {
	// Load Attendees Events Bootstraptable
	// _current_events_table.bootstrapTable({ data: data });
	_attendees_table.bootstrapTable({
		url: "/cms/attendees/get_all",
	});
	// _past_events_table.bootstrapTable({
	// 	url: "/cms/events/get_all_past_events",
	// });

	// Events tabbing event listener
	$(document).on("click", ".attendees-table-tab", function (e) {
		let href = $(this).attr("href");
		$(".attendees-table-div").addClass("d-none");
		$(`${href}`).removeClass("d-none");
		// Remove .active class from current active tab
		$("#attendeesTableTabList .nav-item .active").removeClass("active");
		// Add .active class to new active tab
		$(this).addClass("active");
	});

	// ADD
	$("#btnAddAttendee").click((e) => {
		$("#addAttendees").data("event-title", $("#viewAttendees").data("event-title"));
		$("#addAttendees").data("event-fee", $("#viewAttendees").data("event-fee"));
		$("#addAttendees").data("event-link", $("#viewAttendees").data("event-link"));
		$("#addAttendees").data("event-id", $("#viewAttendees").data("event-id")).modal("show");

		$('#ifOther').hide();
		$('#ifOtherLbl').hide();
	});

	// On insert attendees
	$("#addAttendees #btnInsertAttendees").click((e) => {
		
		let flag = false;
		
		// Check if attendee email is already in the backend
		let email = $("#email").val();

		$.ajax({
			data: {
				email: email,
			},
			dataType: "json",
			type: "post",
			async: false,
			url: "attendees/check_email",
			success: function (data) {
				
				if (data == "success") {

					let validate_result = validateForm("addAttendees");
					if (!validate_result.result) {
					
						Swal.fire({
						icon: "error",
						text: `${validate_result.message}.`,
						timer: 1200,
						});
					return;
					}

					let form_data = new FormData();
					form_data.append("firstName", $("#addAttendees #firstName").val());
					form_data.append("middleInitial", $("#addAttendees #middleInitial").val());
					form_data.append("lastName", $("#addAttendees #lastName").val());
					form_data.append("email", $("#addAttendees #email").val());
					form_data.append("contactNo", $("#addAttendees #contactNo").val());
					form_data.append("employment", $("#addAttendees #employment").val());
					form_data.append("employmentDetails", $("#addAttendees #employmentDetails").val());
					form_data.append("affliations", $("#addAttendees #affliations").val());
					form_data.append("source", $("#addAttendees #source").val());
					form_data.append("ifOther", $("#addAttendees #ifOther").val());
					form_data.append("birthday", $("#addAttendees #birthday").val());

					$.ajax({
						data: form_data,
						dataType: "json",
						type: "post",
						processData: false,
						contentType: false,
						url: "attendees/add_attendees",
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
							$("#addAttendees").modal("hide");
							
							if (data != "fail") {
								Swal.fire({
									icon: "success",
									text: "Successfully added delegate.",
									timer: 1200,
								}).then((res) => {
								_attendees_table.bootstrapTable("refresh", { silent: true });
								// Reset add attendee modal
								$("#addAttendees #newUserDiv #tabHeader").empty();
								$("#addAttendees #newUserDiv .new-forms").remove();
								});
							} else {
								Swal.fire({
									icon: "error",
									text: "Problem in adding delegate.",
									timer: 1200,
								}).then((res) => {
								_attendees_table.bootstrapTable("refresh", { silent: true });
								// Reset add attendee modal
								$("#addAttendees #newUserDiv #tabHeader").empty();
								$("#addAttendees #newUserDiv .new-forms").remove();
								});
							}
						},
					});

				} else {
					Swal.fire({
						icon: "error",
						text: `A attendee has already used this email: ${email}.`,
						timer: 1500,
					});
					flag = true;
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});

	});

	// EDIT
	// On click upload proof of employment in edit
	$("#editAttendeeInfo #btnEditProofOfEmployment").click((e) => {
		$("#editAttendeeInfo #proofOfEmployment").click();
	});

	$("#editAttendeeInfo #proofOfEmployment").change(function (e) {
		$("#editAttendeeInfo #proofFileName").text(this.files[0].name);
	});

	$("#editAttendeeInfo #btnUpdateAttendee").click((e) => {
		let validate_result = validateForm("editAttendeeInfo");
		if (!validate_result.result) {
			Swal.fire({
				icon: "error",
				text: `${validate_result.message}.`,
				timer: 1200,
			});
			return;
		}

		let form_data = new FormData();

		form_data.append("attendee_id", $("#editAttendeeInfo").data("attendee-id"));
		form_data.append("first_name", $("#editAttendeeInfo #firstName").val());
		form_data.append("middle_initial", $("#editAttendeeInfo #middleName").val());
		form_data.append("last_name", $("#editAttendeeInfo #lastName").val());
		form_data.append("email_address", $("#editAttendeeInfo #attendeeEmail").val());
		form_data.append("contact_number", $("#editAttendeeInfo #attendeeContact").val());
		form_data.append("employment", $("#editAttendeeInfo #attendeeEmployment").val());
		form_data.append("employmentDetails", $("#editAttendeeInfo #attendeeEmploymentDetails").val());
		form_data.append("affiliation", $("#editAttendeeInfo #attendeeAffiliations").val());
		form_data.append("source", $("#editAttendeeInfo #attendeeSource").val());
		// form_data.append("ifOther", $("#editAttendeeInfo #ifOther").val());
		form_data.append("birthdate", $("#editAttendeeInfo #attendeeBirthday").val());

		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "attendees/update_attendee",
			beforeSend: function() {
				Swal.fire({
		          title: "Please wait",
		          showConfirmButton: false,
		          allowEscapeKey: false,
		          allowOutsideClick: false,
		          onOpen: () => {
		            Swal.showLoading();
		          },
		        });
			},
			success: function (data) {
				$("#editAttendeeInfo").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully updated delegate.",
					timer: 1200,
				}).then((res) => {
					_attendees_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// DELETE
	$("#deleteAttendee #btnDeleteAttendee").click((e) => {
		$.ajax({
			data: {
				attendee_id: $("#deleteAttendee").data("attendee-id"),
				first_name: $("#deleteAttendee").data("first-name"),
				last_name: $("#deleteAttendee").data("last-name"),
				event_title: $("#deleteAttendee").data("event-title"),
			},
			dataType: "json",
			type: "post",
			url: "attendees/delete_attendee",
			beforeSend: function() {
				Swal.fire({
		          title: "Please wait",
		          showConfirmButton: false,
		          allowEscapeKey: false,
		          allowOutsideClick: false,
		          onOpen: () => {
		            Swal.showLoading();
		          },
		        });
			},
			success: function (data) {
				$("#deleteAttendee").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully deleted delegate.",
					timer: 1200,
				}).then((res) => {
					_attendees_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// APPROVE
	$("#approveAttendee #btnApproveAttendee").click((e) => {
		$.ajax({
			data: {
				attendee_id: $("#approveAttendee").data("attendee-id"),
				attendee_name: $("#approveAttendee").data("attendee-name"),
				event_title: $("#approveAttendee").data("event-title"),
			},
			dataType: "json",
			type: "post",
			url: "attendees/approve_attendee",
			beforeSend: function() {
				Swal.fire({
		          title: "Please wait",
		          showConfirmButton: false,
		          allowEscapeKey: false,
		          allowOutsideClick: false,
		          onOpen: () => {
		            Swal.showLoading();
		          },
		        });
			},
			success: function (data) {
				$("#approveAttendee").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully approved attendee for discounted rate.",
					timer: 1200,
				}).then((res) => {
					_attendees_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// DISAPPROVE
	$("#disapproveAttendee #btnDisapproveAttendee").click((e) => {
		$.ajax({
			data: {
				attendee_id: $("#disapproveAttendee").data("attendee-id"),
				attendee_name: $("#disapproveAttendee").data("attendee-name"),
				event_title: $("#disapproveAttendee").data("event-title"),
			},
			dataType: "json",
			type: "post",
			url: "attendees/disapprove_attendee",
			beforeSend: function() {
				Swal.fire({
		          title: "Please wait",
		          showConfirmButton: false,
		          allowEscapeKey: false,
		          allowOutsideClick: false,
		          onOpen: () => {
		            Swal.showLoading();
		          },
		        });
			},
			success: function (data) {
				$("#disapproveAttendee").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully disapproved attendee for discounted rate.",
					timer: 1200,
				}).then((res) => {
					_attendees_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// SEND ZOOM LINK
	$("#sendZoomLink #btnSendZoomLink").click((e) => {
		$.ajax({
			data: {
				attendee_id: $("#sendZoomLink").data("attendee-id"),
				attendee_name: $("#sendZoomLink").data("attendee-name"),
				attendee_email: $("#sendZoomLink").data("attendee-email"),
				event_id: $("#sendZoomLink").data("event-id"),
				event_title: $("#sendZoomLink").data("event-title"),
			},
			dataType: "json",
			type: "post",
			url: "attendees/send_zoom_link",
			beforeSend: function() {
				Swal.fire({
		          title: "Please wait",
		          showConfirmButton: false,
		          allowEscapeKey: false,
		          allowOutsideClick: false,
		          onOpen: () => {
		            Swal.showLoading();
		          },
		        });
			},
			success: function (data) {
				$("#sendZoomLink").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully sent zoom link to attendee.",
					timer: 3000,
				}).then((res) => {
					_attendees_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});
});

// Code for overlapping modals
$(document).on("hidden.bs.modal", function (event) {
	if ($(".modal:visible").length) {
		$("body").addClass("modal-open");
	}
});
