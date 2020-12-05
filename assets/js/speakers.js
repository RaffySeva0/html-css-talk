// CONSTANTS
const _speakers_table = $("#tblSpeakers");
const _speakers_video_table = $('#editSpeakerInfo #tblSpeakersVideoEdit');
const _comments_table = $("#editVideoInfo #tblComments");
const _replies_table = $("#editCommentInfo #tblReplies");
const _view_speaker_video_table = $("#viewSpeakerInfo #tblSpeakersVideoView");

// VARIABLES

// FUNCTIONS
function actionFormatter(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
			<button class="btn btn-info btn-view-speaker">\
       		 <i class="far fa-question-circle"></i> <span class="hidden-sm hidden-xs">View</span>\
	  		</button>
	  		<button class="btn btn-warning btn-edit-speaker text-white">\
        	 <i class="far fa-edit"></i> <span class="hidden-sm hidden-xs">Edit</span>\
      		</button>
      		<button class="btn btn-danger btn-delete-speaker">\
        	 <i class="far fa-trash-alt"></i> <span class="hidden-sm hidden-xs">Delete</span>\
      		</button>
    	</div>`,
	].join("");
}

function actionFormatterView(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
			<button class="btn btn-info btn-view-video">\
       		 <i class="far fa-question-circle"></i> <span class="hidden-sm hidden-xs">View</span>\
	  		</button>
    	</div>`,
	].join("");
}

function actionFormatterEdit(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
	  		<button class="btn btn-warning btn-edit-video text-white">\
        	 <i class="far fa-edit"></i> <span class="hidden-sm hidden-xs">Edit</span>\
      		</button>
      		<button class="btn btn-danger btn-delete-video">\
        	 <i class="far fa-trash-alt"></i> <span class="hidden-sm hidden-xs">Delete</span>\
      		</button>
    	</div>`,
	].join("");
}

function actionFormatterEditComment(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
	  		<button class="btn btn-warning btn-edit-comment text-white">\
        	 <i class="far fa-edit"></i> <span class="hidden-sm hidden-xs">Edit</span>\
      		</button>
      		<button class="btn btn-danger btn-delete-comment">\
        	 <i class="far fa-trash-alt"></i> <span class="hidden-sm hidden-xs">Delete</span>\
      		</button>
    	</div>`,
	].join("");
}

function actionFormatterEditReply(value, row, index) {
	return [
		`<div class="btn-group" role="grid">\
	  		<button class="btn btn-warning btn-edit-reply text-white">\
        	 <i class="far fa-edit"></i> <span class="hidden-sm hidden-xs">Edit</span>\
      		</button>
      		<button class="btn btn-danger btn-delete-reply">\
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
	"click .btn-view-speaker": function (e, value, row) {
		$("#viewSpeakerInfo").modal("show");
		$("#viewSpeakerInfo #viewSpeakerName").text(row.speaker_name);
		$("#viewSpeakerInfo #viewAttendeeEmail").text(row.email_address);
		$("#viewSpeakerInfo #viewAttendeeContact").text(row.contact_number);
		$("#viewSpeakerInfo #viewFacebookName").text(row.fb_name);
		$("#viewSpeakerInfo #viewDescription").text(row.description);
		if (row.speaker_image != "" && row.speaker_image != null) {
			$("#viewSpeakerInfo #viewSpeakerImage").attr("src", `/uploads/speakers/${row.speaker_image}`);
		} else {
			$("#viewSpeakerInfo #viewSpeakerImage").attr("src", `/assets/images/no_image.jpg`);
		}

		let speaker_id = row.speaker_id;

		_view_speaker_video_table.bootstrapTable('destroy');
		_view_speaker_video_table.bootstrapTable({
			url: "/cms/speakers/get_speaker_videos_by_id",
			queryParams: function(p){
				return {
					speaker_id: speaker_id
				}
			}
		});

	},
	"click .btn-edit-speaker": function (e, value, row) {

		$("#editSpeakerInfo #videoFileName").text('');

		$("#editSpeakerInfo").data("speaker-id", row.speaker_id).modal("show");
		$("#editSpeakerInfo #speakerName").val(row.speaker_name);
		$("#editSpeakerInfo #facebookName").val(row.fb_name);
		$("#editSpeakerInfo #email").val(row.email_address);
		$("#editSpeakerInfo #contactNo").val(row.contact_number);
		$("#editSpeakerInfo #description").val(row.description);
		if (row.speaker_image != "" && row.speaker_image != null) {
			$("#editSpeakerInfo #viewSpeakerImage").attr("src", `/uploads/speakers/${row.speaker_image}`);			
		} else {
			$("#editSpeakerInfo #viewSpeakerImage").attr("src", `/assets/images/no_image.jpg`);
		}

		let speaker_id = row.speaker_id;

		_speakers_video_table.bootstrapTable("destroy");
		_speakers_video_table.bootstrapTable({
			url: "/cms/speakers/get_speaker_videos_by_id",
			queryParams: function(p){
				return {
					speaker_id: speaker_id
				}
			}
		});
	},
	"click .btn-delete-speaker": function (e, value, row) {
		$("#deleteSpeaker").data("speaker-id", row.speaker_id).modal("show");
		$("#deleteSpeaker").data("speaker-name", row.speaker_name);
	},
	"click .btn-edit-video": function (e, value, row) {
		$("#editVideoInfo").data("speaker-video-id", row.video_id).modal("show");
		$("#editVideoInfo").data("speaker-name", row.speaker_name);

		$("#editVideoInfo #fileName").val(row.file_name);
		$("#editVideoInfo #videoTopic").val(row.video_topic);
		$("#editVideoInfo #description").val(row.video_description);

		let video_id = row.video_id;

		_comments_table.bootstrapTable("destroy");
		_comments_table.bootstrapTable({
			url: "/cms/speakers/get_videos_comments_by_id",
			queryParams: function(p) {
				return {
					video_id: video_id
				}
			}
		});
		
	},
	"click .btn-delete-video": function (e, value, row) {
		$("#deleteVideoInfo").data("speaker-video-id", row.video_id).modal("show");
		$("#deleteVideoInfo").data("speaker-name", row.speaker_name);
	},
	"click .btn-edit-comment": function (e, value, row) {
		$("#editCommentInfo").data("comment-id", row.comment_id).modal("show");
		// $("#editCommentInfo").data("speaker-name", row.speaker_name);

		$("#editCommentInfo #videoCommentedDate").val(row.comment_date);
		// $("#editCommentInfo #videoCommentedBy").val(row.first_name + '' + row.last_name);

		$.ajax({
			dataType: "json",
			type: "post",
			url: "attendees/get_all",
			success: function (attendees) {
				$("#editCommentInfo #videoCommentedBy").empty();
				for (let i = 0; i < attendees.length; i++) {
					if (attendees[i].attendee_id == row.attendee_id) {
					  $("#editCommentInfo #videoCommentedBy").append(
						`<option value="${attendees[i].attendee_id}" selected>${attendees[i].first_name}${attendees[i].last_name}</option>`
					  );
					} else {
					  $("#editCommentInfo #videoCommentedBy").append(
						`<option value="${attendees[i].attendee_id}">${attendees[i].first_name}${attendees[i].last_name}</option>`
					  );
					}
				  }

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});	

		$("#editCommentInfo #videoComment").val(row.comment);

		let comment_id = row.comment_id;

		_replies_table.bootstrapTable("destroy");
		_replies_table.bootstrapTable({
			url: "/cms/speakers/get_videos_replies_by_id",
			queryParams: function(p) {
				return {
					comment_id: comment_id
				}
			}
		});
		
	},
	"click .btn-delete-comment": function (e, value, row) {
		$("#deleteCommentInfo").data("comment-id", row.comment_id).modal("show");
		$("#deleteCommentInfo").data("speaker-name", row.speaker_name);
		$("#deleteCommentInfo").data("comment", row.comment);
	},
	"click .btn-edit-reply": function (e, value, row) {

		$("#editReplyInfo").data("reply-id", row.reply_id).modal("show");
		// $("#editCommentInfo").data("speaker-name", row.speaker_name);

		$("#editReplyInfo #videoReplyDate").val(row.reply_date);
		$("#editReplyInfo #videoReplyBy").val(row.user_id);
		$("#editReplyInfo #videoReply").val(row.reply);

		let comment_id = row.comment_id;

		$.ajax({
			data: {
				comment_id: comment_id,
			},
			dataType: "json",
			type: "post",
			async: false,
			url: "speakers/get_videos_replies_by_id",
			success: function (data) {

				$('#tblReplies').bootstrapTable('destroy');
				$('#tblReplies').bootstrapTable({ data: data });

			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
		
	},
	"click .btn-delete-reply": function (e, value, row) {
		$("#deleteReplyInfo").data("reply-id", row.reply_id).modal("show");
		$("#deleteReplyInfo").data("speaker-name", row.speaker_name);
	},
};

$(document).ready(() => {
	// Load Attendees Events Bootstraptable
	// _current_events_table.bootstrapTable({ data: data });
	_speakers_table.bootstrapTable({
		url: "/cms/speakers/get_all",
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
	$("#btnAddSpeaker").click((e) => {
        // No needed custom yet
	});

	// On click upload speaker profile image
	$("#addSpeakers #btnUploadSpeakerImage").click((e)=>{
		$("#addSpeakers #speakerImage").click();
	});

	// On pick speaker image
	$("#addSpeakers #speakerImage").change(function(e){
		$("#addSpeakers #fileName").text(this.files[0].name);
	});

	// On insert attendees
	$("#addSpeakers #btnInsertSpeakers").click((e) => {
		
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
			url: "speakers/check_email",
			success: function (data) {
				
				if (data == "success") {

					let form_data = new FormData();
					form_data.append("speakerName", $("#addSpeakers #speakerName").val());
					form_data.append("description", $("#addSpeakers #description").val());
					form_data.append("fbName", $("#addSpeakers #facebookName").val());
					form_data.append("contactNumber", $("#addSpeakers #contactNo").val());
					form_data.append("emailAddress", $("#addSpeakers #email").val());
					if (typeof $("#addSpeakers #speakerImage")[0].files[0] !== "undefined") {
						form_data.append("speakerImage", $("#addSpeakers #speakerImage")[0].files[0]);
					}

					$.ajax({
						data: form_data,
						dataType: "json",
						type: "post",
						processData: false,
						contentType: false,
						url: "speakers/add_speakers",
						beforeSend: function() {
							Swal.fire({
								title: "Please wait, sending login credentials to the registered speaker email.",
							    showConfirmButton: false,
							    allowEscapeKey: false,
							    allowOutsideClick: true,
							    	onOpen: () => {
							        Swal.showLoading();
							        },
							});
						},
						success: function (data) {

							$("#addSpeakers").modal("hide");
							
							if (data != "fail") {
								Swal.fire({
									icon: "success",
									text: "Successfully added speaker.",
									timer: 1200,
								}).then((res) => {
								_speakers_table.bootstrapTable("refresh", { silent: true });
								// Reset add attendee modal
								$("#addSpeakers #newUserDiv #tabHeader").empty();
								$("#addSpeakers #newUserDiv .new-forms").remove();
								});
							} else {
								Swal.fire({
									icon: "error",
									text: "Problem in adding speaker. Please check the email, must be valid email.",
									timer: 1200,
								}).then((res) => {
                                _speakers_table.bootstrapTable("refresh", { silent: true });
								// Reset add attendee modal
								$("#addSpeakers #newUserDiv #tabHeader").empty();
								$("#addSpeakers #newUserDiv .new-forms").remove();
								});
							}
						},
					});

				} else {
					Swal.fire({
						icon: "error",
						text: `The speaker has already used this email: ${email}.`,
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
	// On click upload speaker image (EDIT)
	$("#editSpeakerInfo #btnUploadSpeakerImageEdit").click((e)=>{
		$("#editSpeakerInfo #editSpeakerImage").click();
	});

	// On click upload speaker profile image (EDIT)
	$("#editSpeakerInfo #editSpeakerImage").change(function(e){
		$("#editSpeakerInfo #editFileName").text(this.files[0].name);
	});

	name = '';
	videoArray = [];

	$("#editSpeakerInfo #btnUploadVideoList").click((e) => {
		$("#editSpeakerInfo #videoList").click();
	});

	$("#editSpeakerInfo #videoList").change(function (e) {
		
		for(i= 0; i < $("#editSpeakerInfo #videoList")[0].files.length; i++) {
			name += this.files[i].name + ',';
		}

		$("#editSpeakerInfo #videoFileName").text(name);
	});

	$("#editSpeakerInfo #btnUpdateSpeaker").click((e) => {
		let validate_result = validateForm("editSpeakerInfo");
		if (!validate_result.result) {
			Swal.fire({
				icon: "error",
				text: `${validate_result.message}.`,
				timer: 1200,
			});
			return;
		}

		let form_data = new FormData();
        
		form_data.append("speaker_id", $("#editSpeakerInfo").data("speaker-id"));
        form_data.append("speaker_name", $("#editSpeakerInfo #speakerName").val());
		form_data.append("description", $("#editSpeakerInfo #description").val());
		form_data.append("fb_name", $("#editSpeakerInfo #facebookName").val());
		form_data.append("contact_number", $("#editSpeakerInfo #contactNo").val());
		form_data.append("email_Address", $("#editSpeakerInfo #email").val());
		if (typeof $("#editSpeakerInfo #editSpeakerImage")[0].files[0] !== "undefined") {
			form_data.append("speaker_image", $("#editSpeakerInfo #editSpeakerImage")[0].files[0]);
		}

		// Proof of employment
		if ($("#editSpeakerInfo #videoList")[0].files.length > 0) {
			for(i= 0; i < $("#editSpeakerInfo #videoList")[0].files.length; i++) {
				form_data.append("videoList[]", $("#editSpeakerInfo #videoList")[0].files[i]);
			}
		}

		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "speakers/update_speaker",
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
				$("#editSpeakerInfo").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully updated speaker.",
					timer: 1200,
				}).then((res) => {
					_speakers_table.bootstrapTable("refresh", { silent: true });
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
	$("#deleteSpeaker #btnDeleteSpeaker").click((e) => {
		$.ajax({
			data: {
				speaker_id: $("#deleteSpeaker").data("speaker-id"),
				speaker_name: $("#deleteSpeaker").data("speaker-name"),
			},
			dataType: "json",
			type: "post",
			url: "speakers/delete_speaker",
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
				$("#deleteSpeaker").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully deleted speaker.",
					timer: 1200,
				}).then((res) => {
					_speakers_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// UPDATE SPEAKER VIDEO
	$("#editVideoInfo #btnUpdateSpeakerVideo").click((e) => {
		let validate_result = validateForm("editVideoInfo");
		if (!validate_result.result) {
			Swal.fire({
				icon: "error",
				text: `${validate_result.message}.`,
				timer: 1200,
			});
			return;
		}

		let form_data = new FormData();
        
		form_data.append("video_id", $("#editVideoInfo").data("speaker-video-id"));
        form_data.append("file_name", $("#editVideoInfo #fileName").val());
		form_data.append("video_description", $("#editVideoInfo #description").val());
		form_data.append("video_topic", $("#editVideoInfo #videoTopic").val());
		
		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "speakers/update_speaker_video",
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
				$("#editVideoInfo").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully updated speaker video information.",
					timer: 1200,
				}).then((res) => {
					_speakers_video_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// DELETE SPEAKER VIDEO
	$("#deleteVideoInfo #btnDeleteSpeakerVideo").click((e) => {

		$.ajax({
			data: {
				video_id: $("#deleteVideoInfo").data("speaker-video-id"),
				speaker_name: $("#deleteVideoInfo").data("speaker-name"),
			},
			dataType: "json",
			type: "post",
			url: "speakers/delete_speaker_video",
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
				$("#deleteVideoInfo").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully deleted speaker.",
					timer: 1200,
				}).then((res) => {
					_speakers_video_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// ADD modal open
	$("#AddBtnComment").click((e) => {
		// No needed custom yet
		
		$("#addCommentInfo").modal("show");

		$.ajax({
			dataType: "json",
			type: "post",
			url: "attendees/get_all",
			success: function (attendees) {
				$("#videoCommentedBy").empty();
				if (attendees) {
					$.each(attendees, (i, attendees)=>{
						$("#videoCommentedBy").append(`<option value="${attendees.attendee_id}">${attendees.first_name} ${attendees.last_name}  </option>`);
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

	// ADD
	$("#btnAddComment").click((e) => {
		// No needed custom yet
	
		let form_data = new FormData();
		
		form_data.append("comment", $("#addCommentInfo #videoComment").val());
		form_data.append("comment_date", $("#addCommentInfo #videoCommentedDate").val());
		form_data.append("attendee_id", $("#addCommentInfo #videoCommentedBy").val());
		form_data.append("video_id", $("#editVideoInfo").data("speaker-video-id"));

		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "speakers/add_comment",
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
				$("#addCommentInfo").modal("hide");
				
				if (data != "fail") {
					Swal.fire({
						icon: "success",
						text: "Successfully added comment.",
						timer: 1200,
					}).then((res) => {
						_comments_table.bootstrapTable("refresh", { silent: true });
					});
				} else {
					Swal.fire({
						icon: "error",
						text: "Problem in adding comment.",
						timer: 1200,
					}).then((res) => {
						_comments_table.bootstrapTable("refresh", { silent: true });
					});
				}
			},
		});

	});

	// UPDATE COMMENTS VIDEO
	$("#editCommentInfo #btnUpdateVideoComment").click((e) => {
		let validate_result = validateForm("editCommentInfo");
		if (!validate_result.result) {
			Swal.fire({
				icon: "error",
				text: `${validate_result.message}.`,
				timer: 1200,
			});
			return;
		}

		let form_data = new FormData();

		form_data.append("comment", $("#editCommentInfo #videoComment").val());
		form_data.append("comment_date", $("#editCommentInfo #videoCommentedDate").val());
		form_data.append("attendee_id", $("#editCommentInfo #videoCommentedBy option:selected").val());
		form_data.append("comment_id", $("#editCommentInfo").data("comment-id"));
		
		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "speakers/update_comment",
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
				$("#editCommentInfo").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully updated video comment.",
					timer: 1200,
				}).then((res) => {
					_comments_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// DELETE SPEAKER VIDEO
	$("#deleteCommentInfo #btnDeleteComment").click((e) => {

		$.ajax({
			data: {
				comment_id: $("#deleteCommentInfo").data("comment-id"),
				speaker_name: $("#deleteCommentInfo").data("speaker-name"),
				comment: $("#deleteCommentInfo").data("comment"),
			},
			dataType: "json",
			type: "post",
			url: "speakers/delete_comment",
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
				$("#deleteCommentInfo").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully deleted comment.",
					timer: 1200,
				}).then((res) => {
					_comments_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// ADD modal open
	$("#AddBtnReply").click((e) => {
		// No needed custom yet
		
		$("#addReplyInfo").modal("show");

	});

	// ADD
	$("#btnAddReply").click((e) => {
		// No needed custom yet
	
		let form_data = new FormData();
		
		form_data.append("reply", $("#addReplyInfo #videoReply").val());
		form_data.append("reply_date", $("#addReplyInfo #videoReplyDate").val());
		// form_data.append("user_id", $("#addReplyInfo #videoReplyBy").val());
		form_data.append("comment_id", $("#editCommentInfo").data("comment-id"));

		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "speakers/add_reply",
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
				$("#addReplyInfo").modal("hide");
				
				if (data != "fail") {
					Swal.fire({
						icon: "success",
						text: "Successfully added reply.",
						timer: 1200,
					}).then((res) => {
						_replies_table.bootstrapTable("refresh", { silent: true });
					});
				} else {
					Swal.fire({
						icon: "error",
						text: "Problem in adding reply.",
						timer: 1200,
					}).then((res) => {
						_replies_table.bootstrapTable("refresh", { silent: true });
					});
				}
			},
		});

	});

	// UPDATE REPLY VIDEO
	$("#editReplyInfo #btnUpdateVideoReply").click((e) => {
		let validate_result = validateForm("editReplyInfo");
		if (!validate_result.result) {
			Swal.fire({
				icon: "error",
				text: `${validate_result.message}.`,
				timer: 1200,
			});
			return;
		}

		let form_data = new FormData();

		form_data.append("reply", $("#editReplyInfo #videoReply").val());
		form_data.append("reply_date", $("#editReplyInfo #videoReplyDate").val());
		form_data.append("user_id", $("#editReplyInfo #videoReplyBy").val());
		form_data.append("reply_id", $("#editReplyInfo").data("reply-id"));
		
		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "speakers/update_reply",
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
				$("#editReplyInfo").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully updated video reply.",
					timer: 1200,
				}).then((res) => {
					_replies_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// DELETE REPLY VIDEO
	$("#deleteReplyInfo #btnDeleteReply").click((e) => {

		$.ajax({
			data: {
				reply_id: $("#deleteReplyInfo").data("reply-id"),
				speaker_name: $("#deleteReplyInfo").data("speaker-name"),
			},
			dataType: "json",
			type: "post",
			url: "speakers/delete_reply",
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
				$("#deleteReplyInfo").modal("hide");
				Swal.fire({
					icon: "success",
					text: "Successfully deleted reply.",
					timer: 1200,
				}).then((res) => {
					_replies_table.bootstrapTable("refresh", { silent: true });
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
