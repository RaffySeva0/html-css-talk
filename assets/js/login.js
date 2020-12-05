$(document).ready(function() {
	$("#btnLogin").click((e)=>{

		// Hide credential error alert
		$("#loginCredentialsAlert").addClass('d-none');

		$.ajax({
			data: {
				username: $("#txtUsername").val(),
				password: $("#txtPassword").val(),
			},
			dataType: "json",
			type: "post",
			url: "users/login",
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
				Swal.close(); // Close loading alert
				if (data.status == 'success') {
					if (data.first_login == "1") {
						window.location.replace('/cms/users/view_change_password');
					} else {
						window.location.replace('/cms');
					}
				} else {
					$("#loginCredentialsAlert").text(data.error_message);
					$("#loginCredentialsAlert").removeClass('d-none');
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	$("#btnChangePassword").click((e)=>{

		// Hide credential error alert
		$("#changePasswordAlert").addClass('d-none');

		let new_password = $("#txtNewPassword").val();
		let verify_password = $("#txtVerifyPassword").val();

		if (new_password.localeCompare(verify_password) == 0) {

			$.ajax({
				data: {
					password: new_password
				},
				dataType: "json",
				type: "post",
				url: "../users/change_password",
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
					if ( data == 'success' ) {
						Swal.fire({
							icon: "success",
							text: "Successfully updated password.",
							timer: 3000,
						}).then((res) => {
							window.location.replace('/cms/login');
						});
					} else {
						Swal.fire({
							icon: "error",
							text: "Problem in updating password.",
							timer: 3000,
						}).then((res) => {
							window.location.replace('/cms/users/view_change_password');
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
			$("#changePasswordAlert").removeClass('d-none');
		}

	});
});