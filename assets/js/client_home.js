$(document).ready(function(e){
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

	// On click arrow down
	$(document).on('click', '.btn-arrow-down', function(event) {

	  // Make sure this.hash has a value before overriding default behavior
	  if (this.hash !== "") {
	    // Prevent default anchor click behavior
	   	event.preventDefault();

	    // Store hash
	    var hash = '#main';

	    // Using jQuery's animate() method to add smooth page scroll
	    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
	    $('html, body').animate({
	      scrollTop: $(hash).offset().top
	    }, 800, function(){

	      // Add hash (#) to URL when done scrolling (default click behavior)
	      window.location.hash = hash;
	    });
	  } // End if
  });

	// On open register viewer modal
	$('#signupModal').on('show.bs.modal', function (e) {
	  // Init birthdate datepicker
	  $("#signupModal #birthdate").datetimepicker("destroy");
	  $("#signupModal #birthdate").datetimepicker({
	  	format: 'L',
	  	allowInputToggle: true
	  });
	});

	// On submit registration form
	$("#btnRegisterViewer").click((e)=>{
		let obj = {
			first_name: $("#signupModal #firstName").val(),
			middle_initial: $("#signupModal #middleInitial").val(),
			last_name: $("#signupModal #lastName").val(),
			email_address: $("#signupModal #emailAddress").val(),
			contact_number: $("#signupModal #contactNumber").val(),
			birthdate: $("#signupModal #birthdate").datetimepicker("viewDate").format("YYYY-MM-DD"),
			employment: $("#signupModal #employment").val(),
			affiliation: $("#signupModal #affiliation").val(),
			school: $("#signupModal #employmentDetails").val(),
			source: $("#signupModal #source").val(),
		};

		// Check if speaker email is duplicate
		$.ajax({
			data: {
				email: obj.email_address,
			},
			dataType: "json",
			type: "post",
			async: false,
			url: "home/check_attendee_email",
			success: function (data) {
				if (data == "success") {
					$.ajax({
						data: obj,
						dataType: "json",
						type: "post",
						url: "home/register_viewer",
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
							$("#signupModal").modal("hide");
							
							if (data != "fail") {
								Swal.fire({
									icon: "success",
									text: "Successfully registered for the event. The login credentials has been sent to your email.",
									// timer: 5000,
								}).then((res) => {
									// Clear inout fields
									$("#signupModal .clear-fields").val("");
									// Clear birthdate datepicker
									$('#signupModal #birthdate').datetimepicker('clear');
								});
							} else {
								Swal.fire({
									icon: "error",
									text: "Problem in registering attendee",
									timer: 4000,
								}).then((res) => {
								});
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							console.error(jqXHR);
							console.error(textStatus);
							console.error(errorThrown);
						},
					});
				} else {
					Swal.fire({
						icon: "error",
						text: `${obj.email_address} is already used.`,
						timer: 3000,
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

	// On register speaker
	$("#btnRegisterSpeaker").click((e)=>{
		let obj = {
			speaker_name: $("#signupSpeakerModal #speakerName").val(),
			contact_number: $("#signupSpeakerModal #speakerContact").val(),
			email_address: $("#signupSpeakerModal #speakerEmail").val(),			
		};

		// Check if speaker email is duplicate
		$.ajax({
			data: {
				email: obj.email_address,
			},
			dataType: "json",
			type: "post",
			async: false,
			url: "home/check_speaker_email",
			success: function (data) {
				if (data == "success") {
					$.ajax({
						data: obj,
						dataType: "json",
						type: "post",
						url: "home/register_speaker",
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
							$("#signupSpeakerModal").modal("hide");
							
							if (data != "fail") {
								Swal.fire({
									icon: "success",
									text: "Successfully registered for the event. Please check your email for your login credentials.",
								}).then((res) => {
								});
							} else {
								Swal.fire({
									icon: "error",
									text: "Problem in registering for the event.",
									timer: 4000,
								}).then((res) => {
								});
							}

							// Clear input fields
							$("#signupSpeakerModal .clear-fields").val("");
						},
						error: function (jqXHR, textStatus, errorThrown) {
							console.error(jqXHR);
							console.error(textStatus);
							console.error(errorThrown);
						},
					});
				} else {
					Swal.fire({
						icon: "error",
						text: `${obj.email_address} is already used.`,
						timer: 3000,
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

	$("#btnLoginViewer").click((e)=>{
		let obj = {
			email: $("#loginModal #loginEmailAddress").val(),
			password: $("#loginModal #loginPassword").val(),	
		};

		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			url: "home/login",
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
				$("#loginModal").modal("hide");
				
				if (data.status != "fail") {
					Swal.fire({
						icon: "success",
						text: `Successfully logged in ${data.attendee_info.username}.`,
						timer: 4000,
					}).then((res) => {
						window.location.replace('/eventlobby');
					});
				} else { // If fail means the email and/or password is invalid
					Swal.fire({
						icon: "error",
						text: `${data.error_message}.`,
						timer: 4000,
					}).then((res) => {
					});
				}

				// Clear input fields
				$("#loginModal .clear-fields").val("");
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	$("#btnLoginSpeaker").click((e)=>{
		let obj = {
			email: $("#speakerLoginModal #loginSpeakerEmailAddress").val(),
			password: $("#speakerLoginModal #loginSpeakerPassword").val(),	
		};

		$.ajax({
			data: obj,
			dataType: "json",
			type: "post",
			url: "home/login_speaker",
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
				$("#speakerLoginModal").modal("hide");
				
				if (data.status != "fail") {
					Swal.fire({
						icon: "success",
						text: `Successfully logged in ${data.speaker_info.username}.`,
						timer: 4000,
					}).then((res) => {
						window.location.replace('/eventlobby');
					});
				} else { // If fail means the email and/or password is invalid
					Swal.fire({
						icon: "error",
						text: `${data.error_message}.`,
						timer: 4000,
					}).then((res) => {
					});
				}

				// Clear input fields
				$("#speakerLoginModal .clear-fields").val("");
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});
});