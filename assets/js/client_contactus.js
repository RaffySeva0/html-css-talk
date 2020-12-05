$(document).ready(() => {
	$("#inputMessage").val("");
	$("#contactusForm #btnContactUs").click((e) => {
		e.preventDefault();

		if (formValidationContactUs()) {
			let form_data = new FormData();
			form_data.append("name", $("#inputName").val());
			form_data.append("email", $("#inputEmail").val());
			form_data.append("contact", $("#inputContact").val());
			form_data.append("company", $("#inputCompany").val());
			form_data.append("message", $("#inputMessage").val());

			Swal.fire({
				title: "Please wait",
				showConfirmButton: false,
				allowEscapeKey: false,
				allowOutsideClick: false,
				onOpen: () => {
					Swal.showLoading();
				},
			});

			$.ajax({
				data: form_data,
				dataType: "json",
				type: "post",
				processData: false,
				contentType: false,
				url: "contactUs/send_email",
				success: function (data) {
					if (data === "success") {
						Swal.fire({
							icon: "success",
							text: "You have successfully sent your message.",
							timer: 2500,
						}).then((res) => {
							$("#contactusForm .required-field").each((i, input) => {
								$(input).val("");
								$(input).css("border", "1px solid #CED4DA");
							});
						});
					} else {
						Swal.fire({
							icon: "error",
							text: "Something Went Wrong.",
							timer: 2500,
						});
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.error(jqXHR);
					console.error(textStatus);
					console.error(errorThrown);
				},
			});
		}
	});
});

// functions
const formValidationContactUs = () => {
	var ret = true;

	$("#contactusForm .required-field").each((i, input) => {
		if ($(input).val().trim() === "" || !$(input)[0].checkValidity()) {
			ret = false;
			$(input).css("border", "2px solid #ff917a");
		} else {
			$(input).css("border", "1px solid #CED4DA");
		}
	});

	if (!ret) {
		Swal.fire({
			icon: "warning",
			text: "Please fill in all the required fields.",
			timer: 2000,
		});
	}

	return ret;
};
