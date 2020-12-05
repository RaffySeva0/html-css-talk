// CONSTANTS
// const _current_events_table = $("#tblAttendeesCurrentEvents");
// const _past_events_table = $("#tblAttendeesPastEvents");
const _helpdesk_table = $("#tblHelpdesk");
// VARIABLES

// FUNCTIONS
function actionFormatter(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
			<button class="btn btn-success btn-reply">\
       		 <i class="far fa-question-circle"></i> <span class="hidden-sm hidden-xs">Reply</span>\
	  		</button>
    	</div>`,
	].join("");
}

function eventDateTimeFormatter(value, row) {
	return moment(value).format("MM/DD/YYYY hh:mm a");
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
	"click .btn-reply": function (e, value, row) {
        $("#replyHelp").data("query-id", row.helpdesk_id).modal("show");
        $("#replyHelp #hdquestion").val(row.question);
		$("#replyHelp #hdQuestionDat1").val(row.question_date);
		$("#replyHelp #hdQuestionBy1").val(row.attendee_name);
		$("#replyHelp #hdReply").val(row.reply);
	},
};

$(document).ready(() => {
	// Load Attendees Events Bootstraptable
	// _current_events_table.bootstrapTable({ data: data });
	_helpdesk_table.bootstrapTable({
		url: "/cms/helpdesk/get_all",
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

	// On insert attendees
	$("#replyHelp #btnAddReply").click((e) => {
        
        let form_data = new FormData();

        form_data.append("query_id", $("#replyHelp").data("query-id"));
		form_data.append("reply", $("#replyHelp #hdReply").val());    
        
		$.ajax({
            data: form_data,
            dataType: "json",
            type: "post",
            processData: false,
            contentType: false,
            url: "helpdesk/insert_query_reply",
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
                $("#replyHelp").modal("hide");
                
                if (data != "fail") {
                    Swal.fire({
                        icon: "success",
                        text: "Successfully added response.",
                        timer: 1200,
                    }).then((res) => {
                    _helpdesk_table.bootstrapTable("refresh", { silent: true });
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Problem in adding response(s).",
                        timer: 1200,
                    }).then((res) => {
                    _helpdesk_table.bootstrapTable("refresh", { silent: true });
                    });
                }
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
					text: "Successfully updated attendee.",
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
				attendee_name: $("#deleteAttendee").data("attendee-name"),
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
					text: "Successfully deleted attendee.",
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
