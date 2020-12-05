const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
});

let _playerObj = null;
let _liveTracker = null;

$(document).ready(function(e){
	// Get all comments
	$.ajax({
		data: {
			video_id: $("#videoID").val()
		},
		dataType: "json",
		type: "post",
		url: "../../../../videoprofile/get_comments",			
		success: function (comments) {	
			$.each(comments, (i, comment)=>{
				if ($("#session_role").val() == "speaker") {
					$("#commentsDiv").append(`
						<div class="d-block"><label class="font-weight-bold">${comment.username} ${moment(comment.comment_date).format('MM/DD/YYYY')}: </label> <span>${comment.comment}</span></div>
						<div class="d-block"><button class="btn btn-outline-dark p-1 btn-reply" data-comment-id="${comment.comment_id}">Reply</button></span></div>
						<div class="d-block reply-div-${comment.comment_id}"></div>
					`);
				} else {
					$("#commentsDiv").append(`
						<div class="d-block"><label class="font-weight-bold">${comment.username} ${moment(comment.comment_date).format('MM/DD/YYYY')}: </label> <span>${comment.comment}</span></div>						
						<div class="d-block reply-div-${comment.comment_id}"></div>
					`);
				}

				$.ajax({
					data: {
						comment_id: comment.comment_id
					},
					dataType: "json",
					type: "post",
					url: "../../../../videoprofile/get_replies",
					async: false,
					success: function (replies) {			
						$.each(replies, (i, reply)=>{
							$(`#commentsDiv .reply-div-${comment.comment_id}`).append(`
								<div class="d-block pl-3"><label class="font-weight-bold">${reply.username} ${reply.reply_date}: </label> <span>${reply.reply}</span></div>
							`);			
						});
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.error(jqXHR);
						console.error(textStatus);
						console.error(errorThrown);
					},
				});
			});
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.error(jqXHR);
			console.error(textStatus);
			console.error(errorThrown);
		},
	});

	// Check if attendee already liked the video
	$.ajax({
		data: {
			video_id: $("#videoID").val(),
			attendee_id: $("#session_user_id").val(),
		},
		dataType: "json",
		type: "post",
		url: "../../../../videoprofile/check_for_attendee_like",			
		success: function (data) {				
			if (data) {				
				$("#btnLike").prop('disabled', true);
				// Show like alert
				$("#likeAlert").addClass('d-inline');
			} else {
				$("#likeAlert").addClass('d-none');
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.error(jqXHR);
			console.error(textStatus);
			console.error(errorThrown);
		},
	});

	// Video player START
	// Init video player
	_playerObj = videojs('videoPlayer', {
		fill: true,
		plugins: { eventTracking: true }
	});	

	// _liveTracker = new LiveTracker(_playerObj);
	_playerObj.on('ended', (e, data) => {
		// console.log(_playerObj.currentTime());
		// $("#evaluationModal").modal('show');
		$("#btnEvaluate").prop('disabled', false);
	});

	_playerObj.on('pause', (e, data) => {
		// console.log(_playerObj.currentTime());
		// console.log(_playerObj.duration());
		
		let obj = {
			video_id: $("#videoID").val(),
			end_time: _playerObj.currentTime()
		}

		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			url: "../../../../videoprofile/save_view_video",
			success: function (data) {						
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	window.onbeforeunload = function () {
    	let obj = {
			video_id: $("#videoID").val(),
			end_time: _playerObj.currentTime()
		}

		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			url: "../../../../videoprofile/save_view_video",
			success: function (data) {						
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	};
	// Video player END

	// On click like button
	$("#btnLike").click((e)=>{
		let obj = {
			video_id: $("#videoID").val(),
			attendee_id: $("#session_user_id").val(),
		};

		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			url: "../../../../videoprofile/like_video",			
			success: function (data) {				
				$("#videoLike").text(data.like_count);

				// Disable like button
				$("#btnLike").prop('disabled', true);
				// Show like alert
				$("#likeAlert").addClass('d-inline');
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// On submit comment
	$("#btnComment").click((e)=>{

		// Pop up modal for eval hidden by Matthew
		// $("#evaluationModal").modal("show");
		let obj = {
			video_id: $("#videoID").val(),
			comment: $("#textCommentArea").val()
		};
		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			url: "../../../../videoprofile/submit_comment",
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
				if (data != 'fail') {			
					Swal.fire({
						icon: "success",
						text: "Successfully posted comment.",
						timer: 1200,
					}).then((res) => {
						// Update comment section
						if ($("#session_role").val() == "delegate") {
							$("#commentsDiv").append(`
								<div class="d-block"><label class="font-weight-bold">${$("#session_username").val()} ${moment().format('MM/DD/YYYY')}: </label> <span>${data.comment}</span></div>
							`);
						} else {
							// If user is speaker
							$("#commentsDiv").append(`
								<div class="d-block"><label class="font-weight-bold">${$("#session_username").val()} ${moment().format('MM/DD/YYYY')}: </label> <span>${data.comment}</span></div>
								<div class="d-block"><button class="btn btn-outline-dark p-1 btn-reply" data-comment-id="${data.comment_id}">Reply</button></span></div>
								<div class="d-block reply-div-${data.comment_id}"></div>
							`);
						}
					});
				} else {
					Swal.fire({
						icon: "error",
						text: "Error in posting comment.",
						timer: 1200,
					});
				}
				$("#textCommentArea").val("");
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// On click reply button
	$(document).on('click', '.btn-reply', function(e){
		$("#replyModal").data('comment-id', $(this).data('comment-id')).modal('show');
	});

	// On submit speaker reply
	$("#btnReply").click((e)=>{
		let obj = {
			comment_id: $("#replyModal").data('comment-id'),
			reply: $("#replyModal #txtReply").val()
		};

		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			url: "../../../../videoprofile/submit_reply",
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
				$("#replyModal").modal('hide');
				if (data != "fail") {			
					Swal.fire({
						icon: "success",
						text: "Successfully posted reply.",
						timer: 1200,
					}).then((res) => {
						// Update comment section
						$(`#commentsDiv .reply-div-${obj.comment_id}`).append(`
							<div class="d-block pl-3"><label class="font-weight-bold">${$("#session_username").val()} ${moment().format('MM/DD/YYYY')}: </label> <span>${obj.reply}</span></div>
						`);
					});
				}
				$("#replyModal #txtReply").val("");
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// On click logout button/link
	$("#btnLogout").click((e)=>{
		swalWithBootstrapButtons.fire({
		  	title: 'Do you want to logout?',
		  	// text: "You won't be able to revert this!",
		  	icon: 'warning',
		  	showCancelButton: true,
		  	confirmButtonText: 'Yes',
		  	cancelButtonText: 'No',
		  	reverseButtons: true
		}).then((result) => {
		  if (result.isConfirmed) {
		  	// If user logout
		  	window.location.replace('/home/logout');
		    // swalWithBootstrapButtons.fire(
		    //   'Deleted!',
		    //   'Your file has been deleted.',
		    //   'success'
		    // )
		  } else if (
		    /* Read more about handling dismissals below */
		    result.dismiss === Swal.DismissReason.cancel
		  ) {
		    // swalWithBootstrapButtons.fire(
		    //   'Cancelled',
		    //   'Your imaginary file is safe :)',
		    //   'error'
		    // )
		  }
		})
	})
});