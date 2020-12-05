const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
});

$(document).ready(function(e){
	// Get all speakers
	$.ajax({
		dataType: "json",
		type: "post",
		url: "videolibrary/get_all_speakers",
		success: function (speakers) {
			$("#selSpeaker").empty();
			$("#selSpeaker").append(`<option>ALL</option>`);
			if (speakers) {
				$.each(speakers, (i, speaker)=>{
					$("#selSpeaker").append(`<option value="${speaker.speaker_id}">${speaker.speaker_name}</option>`);
				});			
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.error(jqXHR);
			console.error(textStatus);
			console.error(errorThrown);
		},
	});

	// Get all categories
	$.ajax({
		dataType: "json",
		type: "post",
		url: "videolibrary/get_all_video_categories",
		success: function (categories) {
			$("#selCategory").empty();
			$("#selCategory").append(`<option>ALL</option>`);
			if (categories) {
				$.each(categories, (i, category)=>{
					$("#selCategory").append(`<option>${category.category}</option>`);
				});			
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.error(jqXHR);
			console.error(textStatus);
			console.error(errorThrown);
		},
	});

	// On click filter button
	$("#btnFilter").click((e)=>{
		let obj = {
			speaker_id: $("#selSpeaker").val(),
			category: $("#selCategory").val(),
		}

		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			url: "videolibrary/filter_videos",
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
			success: function (videos) {
				console.log(videos);
				$("#videoLibraryDiv").empty();
				Swal.close();
				if (videos.length > 0) {
					$.each(videos, (i, video)=>{
						$("#videoLibraryDiv").append(`
							<div class="col-md-12 col-lg-6 col-xl-4 pt-3 pb-3">
					            <div style="background: url('/assets/images/theatre.jpg'); background-repeat: no-repeat; background-position: center; background-size: cover; height: 500px; position: relative;">
					              	<div class="pl-4 pb-2 pt-3 w-100" style="background-color: #06385d; position: absolute; bottom: 0; border-bottom: 4px solid #73AD21; border-radius: 300px 500px 500px 0;">
					                	<a href="/videoprofile/video/${video.video_id}"><h4 class="font-weight-bold text-light" style="position: relative; top: 90%;">${video.video_topic}</h4></a>
					                	<span class="font-weight-bold text-light" style="position: relative; top: 88%;">${video.speaker_name}</span>
					              	</div>
					            </div>
					        </div>
						`);
					});
				} else {
					$("#videoLibraryDiv").append(`
						<div class="alert alert-danger mx-auto" role="alert">
  							No videos found.
						</div>
					`);
				}
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