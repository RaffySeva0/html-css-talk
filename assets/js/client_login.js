var loginForm = `
        <p class="text-dark-blue text-large">
          To join the ongoing event, please login:
        </p>
        <form id="eventLoginForm">
          <div class="form-group">
            <input class="form-control required-field" id="inputAttendeeNumber" placeholder="EVENT ATTENDEE NUMBER" type="text">
            </input>
          </div>
          <div class="form-group">
            <input class="form-control required-field" id="inputAttendeePassword" placeholder="EVENT ATTENDEE PASSWORD" type="password">
            </input>
          </div>
          <button class="btn btn-outline-dark btn-content" id="loginJoin" type="button">
            JOIN
          </button>
        </form>`;

var event_id;

$(document).ready(() => {
	$("#loginEventNav").click(() => {
		$.ajax({
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "home/get_ongoing_event",
			success: function (data) {
				if (data !== "empty") {
					// $("#loginEventTitle").text(data[0].event_title);
					// event_id = data[0].event_id;
					$("#loginModal #selectEventTitle").empty();					
					$.each(data, (i, event)=>{
						$("#loginModal #selectEventTitle").append(`<option value="${event.event_id}">${event.event_title}</option>`);
					});
					$("#loginModal #selectEventTitle").change();
				} else {
					$("#loginModal .modal-body").html("<h1>No Ongoing Events</h1>");
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// On change event dropdown
	$("#loginModal #selectEventTitle").change(function(e){
		event_id = $(this).val();

		// Empty zoom link div
		$("#loginModal #loginEventDetails").html("");
		// Show join button
		$("#loginJoin").show();

		// Show event details
		$(".login-event-data").text("");
		$.ajax({
			data: {
				event_id: event_id
			},
			dataType: "json",
			type: "post",
			url: "cms/events/get_event",
			async: false,
			success: function (data) {
				$("#loginModal #loginEventTitle").text(data.event_title);
				$("#loginModal #loginEventDate").text( moment(data.event_date_time).format("MM/DD/YYYY hh:mm a") );
				$("#loginModal #loginAboutSpeakers").text(data.event_about_speakers);
				$("#loginModal #loginEventDescription").text(data.event_description);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	$("#loginJoin").click(() => {
		if (formValidationLogin()) {
			let form_data = new FormData();
			form_data.append(
				"event_attendee_number",
				$("#inputAttendeeNumber").val()
			);
			form_data.append("password", $("#inputAttendeePassword").val());
			form_data.append("event_id", event_id);

			$.ajax({
				data: form_data,
				dataType: "json",
				type: "post",
				processData: false,
				contentType: false,
				url: "home/login_event",
				success: function (data) {
					if (data === "fail") {
						Swal.fire({
							icon: "error",
							text:
								"The event attendee number or password that you've entered does not match any attendee. Please register to the event or recheck your credentials.",
						});
					} else {
						// Swal.fire({
						// 	icon: "success",
						// 	text: "",
						// 	timer: 2500,
						// }).then((res) => {});
						$("#loginEventDetails")
							.html(`<p class="text-dark-blue font-weight-bold">
          PLEASE CLICK ZOOM LINK BELOW TO LAUNCH ZOOM AND JOIN EVENT:</p>
          <p><a href="${data.event_zoom_link}">${data.event_zoom_link}</a></p>`);
						$("#loginJoin").hide();
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

	$("#loginModal").on("hide.bs.modal", (e) => {
		$("#loginEventDetails").empty();
		$("#loginJoin").show();
		$("#inputAttendeeNumber").val("");
		$("#inputAttendeePassword").val("");
	});
});

const formValidationLogin = () => {
	var ret = true;

	$("#eventLoginForm .required-field").each((i, input) => {
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
