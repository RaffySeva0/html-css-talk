$(document).ready(() => {
	$(".footer-subscriber #btnSubscribe").click((e) => {
		e.preventDefault();

		if (
			$("#inputSubscriberEmail").val().trim() !== "" &&
			$("#inputSubscriberEmail")[0].checkValidity()
		) {
			let form_data = new FormData();
			form_data.append("email", $("#inputSubscriberEmail").val());

			$.ajax({
				data: form_data,
				dataType: "json",
				type: "post",
				processData: false,
				contentType: false,
				url: "home/add_subscriber",
				success: function (data) {
					if (data === "success") {
						Swal.fire({
							icon: "success",
							text: "You have successfully subscribed to our newsletter.",
							timer: 2500,
						}).then((res) => {
							$("#inputSubscriberEmail").val("");
						});
					} else if (data === "flagged") {
						Swal.fire({
							icon: "info",
							text: "Your Email has already subscribed to our newsletter.",
							timer: 2500,
						}).then((res) => {
							$("#inputSubscriberEmail").val("");
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
		} else {
			Swal.fire({
				icon: "warning",
				text: "Please enter a valid email.",
				timer: 2500,
			});
		}
	});
});

// functions
