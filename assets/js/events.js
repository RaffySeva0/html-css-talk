const _current_event = $("#tblCurrentEvents");
const _reserved_guest = $('#tblReservedGuest');

// Cleave
const _event_fee_add = new Cleave('#addEvent #eventRegistrationFee', {
  numeral: true,
  numeralPositiveOnly: true,
  prefix: "$",
  rawValueTrimPrefix: true,
  numeralThousandsGroupStyle: "thousand",
});
const _event_fee_edit = new Cleave('#editEvent #editEventRegistrationFee', {
  numeral: true,
  numeralPositiveOnly: true,
  prefix: "$",
  rawValueTrimPrefix: true,
  numeralThousandsGroupStyle: "thousand",
});

function actionFormatter(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
			<button class="btn btn-info btn-view">\
        <i class="far fa-question-circle"></i> <span class="hidden-sm hidden-xs">View</span>\
      </button>
    </div>`
	].join("");
}

function actionFormatterPast(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
			<button class="btn btn-info btn-view">\
        <i class="far fa-question-circle"></i> <span class="hidden-sm hidden-xs">View</span>\
      </button>
      <button class="btn btn-dark btn-unpost">\
      	<i class="fas fa-undo-alt"></i> <span class="hidden-sm hidden-xs">Unpost</span>\
      </button>
    </div>`
	].join("");
}

function actionFormatterCanceled(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
			<button class="btn btn-info btn-view">\
        <i class="far fa-question-circle"></i> <span class="hidden-sm hidden-xs">View</span>\
      </button>
      <button class="btn btn-dark btn-return">\
      	<i class="fas fa-undo-alt"></i> <span class="hidden-sm hidden-xs">Return to Current</span>\
      </button>
    </div>`
	].join("");
}

function eventDateTimeFormatter(value, row) {
	return moment(value).format("MM/DD/YYYY hh:mm a");
}

window.operateEvents = {
	"click .btn-view": function (e, value, row) {
		$("#viewEvent").modal("show");
		// $("#tblReservedGuest").bootstrapTable({ data: _guest_data });
		_reserved_guest.bootstrapTable({
			url: "/cms/events/get_all_reserved",
		});
	},
	"click .btn-edit": function (e, value, row) {
		$("#editEvent").data("event-id", row.event_id).modal("show");
		$("#editEvent #editEventTitle").val(row.event_title);
		$("#editEvent #editEventDescription").val(row.event_description);
		$("#editEvent #editAboutSpeaker").val(row.event_about_speakers);
		$("#editEvent #editEventLocation").val(row.event_location);
		$("#editEvent #editEventDateTime").datetimepicker("destroy");
		$("#editEvent #editEventDateTime").datetimepicker({
			date: moment(row.event_date_time),
			allowInputToggle: true,
		});
		_event_fee_edit.setRawValue(row.registration_fee);
		$("#editEvent #editZoomLink").val(row.event_zoom_link);

		// Images
		$("#editEvent .event-img-filename-edit").text("");
		if (row.img_1 != null) {
			$("#editEvent #eventImgFilenameedit1").text(row.img_1);
		}

		if (row.img_2 != null) {
			$("#editEvent #eventImgFilenameedit2").text(row.img_2);
		}

		if (row.img_3 != null) {
			$("#editEvent #eventImgFilenameedit3").text(row.img_3);
		}
	},
	"click .btn-cancel": function (e, value, row) {
		$("#cancelEvent").data("event-title", row.event_title);
		$("#cancelEvent").data("event-id", row.event_id).modal("show");
	},
	"click .btn-post": function (e, value, row) {
		$("#postEvent").data("event-title", row.event_title);
		$("#postEvent").data("event-id", row.event_id).modal("show");
	},
	// past events
	"click .btn-unpost": function (e, value, row) {
		$("#unpostEvent").data("event-title", row.event_title);
		$("#unpostEvent").data("event-id", row.event_id).modal("show");
	},
	// canceled events
	"click .btn-return": function (e, value, row) {
		$("#returnEvent").data("event-title", row.event_title);
		$("#returnEvent").data("event-id", row.event_id).modal("show");
	},
};

$(document).ready(() => {
	// Change the icons in Tempus Dominus constructor
	$.fn.datetimepicker.Constructor.Default = $.extend({}, $.fn.datetimepicker.Constructor.Default, {
		icons: {
			time: "fas fa-clock",
			date: "fas fa-calendar",
			up: "fas fa-arrow-up",
			down: "fas fa-arrow-down",
			previous: "fas fa-arrow-circle-left",
			next: "fas fa-arrow-circle-right",
			today: "far fa-calendar-check-o",
			clear: "fas fa-trash",
			close: "far fa-times",
		},
	});

	// Load Events Bootstraptable
	// $("#tblCurrentEvents").bootstrapTable({ data: data });
	_current_event.bootstrapTable({
		url: "/cms/events/get_all",
	});
	// _current_event.bootstrapTable({ data: data });

	// Events tabbing event listener
	$(document).on('click', '.events-table-tab', function(e) {
		let href = $(this).attr('href');
		$('.event-table-div').addClass('d-none');		
		$(`${href}`).removeClass('d-none');
		// Remove .active class from current active tab
		$("#eventsTableTabList .nav-item .active").removeClass("active");
		// Add .active class to new active tab
		$(this).addClass("active");
	});

	// ADD
	$("#btnAddEvent").click((e) => {
		$("#addEvent #eventDateTime").datetimepicker({
			allowInputToggle: true,
		});
	});

	// On click upload image button
	$("#addEvent #btnUploadEventImg1").click((e) => {
		$("#addEvent #eventImg1").click();
	});
	$("#addEvent #btnUploadEventImg2").click((e) => {
		$("#addEvent #eventImg2").click();
	});
	$("#addEvent #btnUploadEventImg3").click((e) => {
		$("#addEvent #eventImg3").click();
	});

	// On select event image
	$(document).on('change', '.event-img-div-add .event-img-input-add', function(e){
		$(this).closest('.event-img-div-add').find('.event-img-filename').text(this.files[0].name);
	});

	$("#addEvent #btnCreateEvent").click((e) => {
		let form_data = new FormData();
		form_data.append("event_title", $("#addEvent #eventTitle").val());
		form_data.append("event_description", $("#addEvent #eventDescription").val());
		form_data.append("event_about_speakers", $("#addEvent #aboutSpeaker").val());
		form_data.append("event_location", $("#addEvent #eventLocation").val());
		form_data.append(
			"event_date_time",
			$("#addEvent #eventDateTime").datetimepicker("viewDate").format("YYYY-MM-DD HH:mm")
		);
		form_data.append("registration_fee", _event_fee_add.getRawValue());
		form_data.append("event_zoom_link", $("#addEvent #zoomLink").val());
		// Images
		if ($("#addEvent #eventImg1")[0].files.length > 0) {
			form_data.append("img_1", $("#addEvent #eventImg1")[0].files[0]);
		}
		if ($("#addEvent #eventImg2")[0].files.length > 0) {
			form_data.append("img_2", $("#addEvent #eventImg2")[0].files[0]);
		}
		if ($("#addEvent #eventImg3")[0].files.length > 0) {
			form_data.append("img_3", $("#addEvent #eventImg3")[0].files[0]);
		}

		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "events/add_event",
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
				$("#addEvent").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully created event.",
					timer: 1200,
				}).then((res) => {
					_current_event.bootstrapTable("refresh", { silent: true });
					// Clean add event form
					$("#addEvent #eventTitle").val("");
					$("#addEvent #eventDescription").val("");
					$("#addEvent #aboutSpeaker").val("");
					$("#addEvent #eventLocation").val("");
					$("#addEvent #eventDateTime").datetimepicker('destroy');
					_event_fee_add.setRawValue("");
					$("#addEvent #zoomLink").val("");
					// Images
					$("#addEvent .event-img-input-add").val("");
					$("#addEvent .event-img-filename").text("");
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// On close add event modal
	// $('#addEvent').on('hidden.bs.modal', function (e) {
 //  	// Clean add event form
	// 	$("#addEvent .event-img-filename").text("");
	// });

	// EDIT
	// On click upload image button
	$("#editEvent #btnUploadEventImg1Edit").click((e) => {
		$("#editEvent #editEventImg1").click();
	});
	$("#editEvent #btnUploadEventImg2Edit").click((e) => {
		$("#editEvent #editEventImg2").click();
	});
	$("#editEvent #btnUploadEventImg3Edit").click((e) => {
		$("#editEvent #editEventImg3").click();
	});

	// On select event image
	$(document).on('change', '.event-img-div-edit .event-img-input-edit', function(e){
		$(this).closest('.event-img-div-edit').find('.event-img-filename-edit').text(this.files[0].name);
	});


	$("#editEvent #btnUpdateEvent").click((e) => {
		let form_data = new FormData();
		form_data.append("event_id", $("#editEvent").data("event-id"));
		form_data.append("event_title", $("#editEvent #editEventTitle").val());
		form_data.append("event_description", $("#editEvent #editEventDescription").val());
		form_data.append("event_about_speakers", $("#editEvent #editAboutSpeaker").val());
		form_data.append("event_location", $("#editEvent #editEventLocation").val());
		form_data.append(
			"event_date_time",
			$("#editEvent #editEventDateTime").datetimepicker("viewDate").format("YYYY-MM-DD HH:mm")
		);
		form_data.append("registration_fee", _event_fee_edit.getRawValue());
		form_data.append("event_zoom_link", $("#editEvent #editZoomLink").val());
		// Images
		if ($("#editEvent #editEventImg1")[0].files.length > 0) {
			form_data.append("img_1", $("#editEvent #editEventImg1")[0].files[0]);
		}
		if ($("#editEvent #editEventImg2")[0].files.length > 0) {
			form_data.append("img_2", $("#editEvent #editEventImg2")[0].files[0]);
		}
		if ($("#editEvent #editEventImg3")[0].files.length > 0) {
			form_data.append("img_3", $("#editEvent #editEventImg3")[0].files[0]);
		}

		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "events/update_event",
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
				$("#editEvent").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully updated event.",
					timer: 1200,
				}).then((res) => {
					_current_event.bootstrapTable("refresh", { silent: true });
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
	$("#cancelEvent #btnCancelEvent").click((e) => {
		$.ajax({
			data: {
				event_id: $("#cancelEvent").data("event-id"),
				event_title: $("#cancelEvent").data("event-title"),
			},
			dataType: "json",
			type: "post",
			url: "events/cancel_event",
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
				$("#cancelEvent").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully canceled event.",
					timer: 1200,
				}).then((res) => {
					_current_event.bootstrapTable("refresh", { silent: true });
					_canceled_event.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// POST
	$("#postEvent #btnPostEvent").click((e) => {
		$.ajax({
			data: {
				event_id: $("#postEvent").data("event-id"),
				event_title: $("#postEvent").data("event-title"),
			},
			dataType: "json",
			type: "post",
			url: "events/post_event",
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
				$("#postEvent").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully posted event.",
					timer: 1200,
				}).then((res) => {
					_current_event.bootstrapTable("refresh", { silent: true });
					_past_event.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// UNPOST
	$("#unpostEvent #btnUnpostEvent").click((e) => {
		$.ajax({
			data: {
				event_id: $("#unpostEvent").data("event-id"),
				event_title: $("#unpostEvent").data("event-title"),
			},
			dataType: "json",
			type: "post",
			url: "events/unpost_event",
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
				$("#unpostEvent").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully unposted event back to Current Events.",
					timer: 1200,
				}).then((res) => {
					_current_event.bootstrapTable("refresh", { silent: true });
					_past_event.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// RETURN
	$("#returnEvent #btnReturnEvent").click((e) => {
		$.ajax({
			data: {
				event_id: $("#returnEvent").data("event-id"),
				event_title: $("#returnEvent").data("event-title"),
			},
			dataType: "json",
			type: "post",
			url: "events/return_event",
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
				$("#returnEvent").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully returned event to Current Events.",
					timer: 1200,
				}).then((res) => {
					_current_event.bootstrapTable("refresh", { silent: true });
					_canceled_event.bootstrapTable("refresh", { silent: true });
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
