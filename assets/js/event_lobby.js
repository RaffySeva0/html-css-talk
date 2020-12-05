const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
});
const _helpdesk_table = $("#helpdeskModal #tblFrontHelpDesk");

$(document).ready(function(e){
	// SCROLLIFY START
	$.scrollify({
	    section : ".sections",
	    easing: "easeOutExpo",
		scrollSpeed: 1000,
		offset : 0,
		updateHash: false,
		setHeights: false
  	});	

	// On open any modal, diable scrollify
	$(document).on('shown.bs.modal', '.modal', function (e) {
  		$.scrollify.disable();
	});

	$(document).on('hidden.bs.modal', '.modal', function (e) {
  		$.scrollify.enable();
	});
	// SCROLLIFY END

	// NAV START
	$(".navbar a").on('click', function(event) {

    	// // Make sure this.hash has a value before overriding default behavior
    	// if (this.hash !== "") {
    	//   // Prevent default anchor click behavior
    	// 	event.preventDefault();

    	//   // Store hash
    	//   var hash = this.hash;

    	//   // Using jQuery's animate() method to add smooth page scroll
    	//   // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
    	//   $('html, body').animate({
    	//     scrollTop: $(hash).offset().top
    	//   }, 800, function(){

    	//     // Add hash (#) to URL when done scrolling (default click behavior)
    	//     window.location.hash = hash;
    	//   });
    	// } // End if
	    if (this.hash !== "" || this.hash !== "#") {
	    	let hash = this.hash;
	    	$.scrollify.move(hash);
	    }
  	});

  	// On user logout
  	$(document).on("click", ".btnLogout", (e)=>{
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
		});
	});
	// NAV END

	// Photobooth START
	$("#btnPhotobooth").click((e)=>{
		$("#photoboothModal").modal("show");
		// $("#photoboothDiv").photobooth();
		// Call onCapture method to open webcam
		// onCapture();
	});

	// On close photobooth modal
	$('#photoboothModal').on('hide.bs.modal', function (e) {
		// Call clearAll() function to close camera
	  	clearAll();
	});

	// On click upload button
	$("#photoboothModal #btnAddWatermark").click((e)=>{
		$("#photoboothModal #waterMarkImg").click();
	});

	// On upload image
	$("#photoboothModal #waterMarkImg").change(function(e){
		// Upload image to temp folder
		let form = new FormData();
		
		form.append('img', this.files[0]);

		$.ajax({
			data: form,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "eventlobby/upload_image",
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

				// if (data != "false") {
				// 	// Watermark START				
				// 	watermark([`/uploads/temp/${data}`, '/assets/images/aninag-logo-blue-small.png'])
				// 	  .dataUrl(watermark.image.lowerRight(0.5))
				// 	  .then((img)=>{
				// 	  	// console.log(img);
				// 	  	download = document.createElement('a');
				// 	    download.href = img;
				// 	    download.download = `watermark${data}`;
				// 	    download.style.display = 'none';
				// 	    document.body.appendChild(download);
				// 	    download.click();
				// 	    document.body.removeChild(download);
				// 	  });

				// 	Swal.fire({
				// 		icon: "success",
				// 		text: "Nice",
				// 		timer: 3000,
				// 	});
				// 	// Watermark END
				// } else {
				// 	Swal.fire({
				// 		icon: "error",
				// 		text: "Uploaded image is invalid",
				// 		timer: 3000,
				// 	});
				// }
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});
	// Photobooth END

	// Help desk START
	$("#btnHelpDesk").click((e)=>{
		$("#helpdeskModal").modal('show');

		// Init table
		_helpdesk_table.bootstrapTable('destroy');
		_helpdesk_table.bootstrapTable({
			url: "eventlobby/get_helpdesk_inquiries"
		});
	});

	// On submit inquiry
	$("#addInquiryModal #btnSubmitInquiry").click((e)=>{
		let obj = {
			inquiry: $("#addInquiryModal #txtInquiry").val()
		}

		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			async: false,
			url: "eventlobby/add_inquiry",
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
			
				$("#addInquiryModal").modal("hide");
							
				if (data != "fail") {
					swal.fire({
						icon: "success",
						text: "Successfully submitted your inquiry.",
						timer: 3000,
					}).then((res) => {
                    	_helpdesk_table.bootstrapTable("refresh", { silent: true });
                    	$("#addInquiryModal #txtInquiry").val("");
                    });
				} else {
					Swal.fire({
						icon: "error",
						text: "There is an error during submitting your inquiry.",
						timer: 3000,
					});
				}

			},
		});
	});
	// Help desk END

	// On open auditorium modal
	$('#auditoriumModal').on('show.bs.modal', function (e) {

		$.ajax({
			dataType: "json",
			type: "post",
			url: "eventlobby/get_all_live_events",
			success: function (events) {
				$("#selEvent").empty();
				if (events) {
					$.each(events, (i, events)=>{
						$("#selEvent").append(`<option value="${events.live_event_id}">${events.title}</option>`);
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

	$("#reserveLive").click((e) => {
		
		// let form_data2 = new FormData();
		
		// form_data2.append("liveEventId", $('#selEvent').val());
		// form_data2.append("slotsReserved", $('#slotsReserved').val());
		// form_data2.append("attendeeId", $('#attendee_id').text());
		let obj = {
			liveEventId : $('#selEvent').val(),
			// slotsReserved : $('#slotsReserved').val(),
			attendeeId  : $('#attendee_id').val(),
		}

		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			async: false,
			url: "eventlobby/reserve",
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
			
				$("#auditoriumModal").modal("hide");
							
				if (data != "fail") {
					swal.fire({
						icon: "success",
						text: "Successfully added your reservation.",
						timer: 1200,
					});
				} else {
					Swal.fire({
						icon: "error",
						text: "Delegate already reserved for selected event.",
						timer: 1200,
					});
				}

			},
		});
		
	});

	// On click see more button
	// $(document).on('click', '.btn-see-more', function(e){
	// 	console.log('jajajaj');
	// 	// var dots = document.getElementById("dots");
	//  //  var moreText = document.getElementById("more");
	//  //  var btnText = document.getElementById("myBtn");

	//  //  if (dots.style.display === "none") {
	//  //    dots.style.display = "inline";
	//  //    btnText.innerHTML = "Read more"; 
	//  //    moreText.style.display = "none";
	//  //  } else {
	//  //    dots.style.display = "none";
	//  //    btnText.innerHTML = "Read less"; 
	//  //    moreText.style.display = "inline";
	//  //  }
	//   let dots = $(this).closest('section').find('.dots');
	//   let moreText = $(this).closest('section').find('.more');
	//   if (dots.css('display') === "none") { // If dots is hidden
	//   	dots.css('display', 'inline');
	//   	moreText.css('display', 'none');
	//   } else {
	//   	dots.css('display', 'none');
	//   	moreText.css('display', 'inline');
	//   }

	//   $(this).css('display', 'none');
	// });
});