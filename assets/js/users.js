const data = [
	{
		username: "john_doe",
		role: "Administrator",
	},
];
const _users_table = $("#tblUsers");

function actionFormatter(value, row, index) {
	let resetPassBtn = '';

	if (row.role != "Administrator") {
		resetPassBtn = `<button class="btn btn-dark btn-reset-pass">\
        					<i class="fas fa-undo-alt"></i> <span class="hidden-sm hidden-xs">Reset User Password</span>\
      					</button>`;
	}

	return [
		`<div class="btn-group" role="grid">\
	      	<button class="btn btn-warning btn-edit text-white">\
	        	<i class="far fa-edit"></i> <span class="hidden-sm hidden-xs">Edit</span>\
	      	</button>
	      	<button class="btn btn-danger btn-delete">\
	        	<i class="far fa-trash-alt"></i> <span class="hidden-sm hidden-xs">Delete</span>\
	      	</button>
      		${resetPassBtn}
    	</div>`,
	].join("");
}

window.operateEvents = {
	"click .btn-edit": function (e, value, row) {
		$("#editUser").data('user-id', row.user_id).modal("show");
		$("#editUser #editUsername").val(row.username);
		$("#editUser #editRole").val(row.role);

		// If user is Administrator, show password field, else hide
		$("#editUser #editPasswordDiv").hide();
		if (row.role == "Administrator") {
			$("#editUser #editPasswordDiv").show();
		}
	},
"click .btn-delete": function (e, value, row) {
		$("#deleteUser").data('username', row.username);
		$("#deleteUser").data('user-id', row.user_id).modal("show");
	},
	"click .btn-reset-pass": function (e, value, row) {
		$("#resetUserPass").data('username', row.username);
		$("#resetUserPass").data('user-id', row.user_id).modal("show");
	},
};

$(document).ready(() => {
	_users_table.bootstrapTable({ data: data });
	// _users_table.bootstrapTable({
	// 	url: '/cms/users/get_all'
	// });

	// ADD
	// On change user role (ADD)
	$("#addUser #role").change(function(e) {
		$("#addUser #passwordDiv").hide();
		if ($(this).val() == "Administrator") {
			$("#addUser #passwordDiv").show();
		}
	});

	$("#addUser #btnAddUser").click((e)=>{
		let role = $("#addUser #role").val();

		$.ajax({
			data: {
				username: $("#addUser #username").val(),
				password: $("#addUser #password").val(),
				role: role,
				first_login: role != "Administrator" ? "1" : "0"
			},
			dataType: "json",
			type: "post",
			url: "users/add_user",
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
				$("#addUser").modal('hide');
				Swal.fire({
					icon: "success",
					text: "Successfully added user.",
					timer: 1500,
				}).then((res) => {
					_users_table.bootstrapTable("refresh", { silent: true });
					// Reset add attendee modal
					$("#addUser #username").val("");
					$("#addUser #password").val("");
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// EDIT
	// On change user role (EDIT)
	$("#editUser #editRole").change(function(e) {
		$("#editUser #editPasswordDiv").hide();
		if ($(this).val() == "Administrator") {
			$("#editUser #editPasswordDiv").show();
		}
	});

	$("#editUser #btnUpdateUser").click((e)=>{
		$.ajax({
			data: {
				user_id: $("#editUser").data('user-id'),
				username: $("#editUser #editUsername").val(),
				password: $("#editUser #editPassword").val(),
				role: $("#editUser #editRole").val()
			},
			dataType: "json",
			type: "post",
			url: "users/update_user",
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
				$("#editUser").modal('hide');
				Swal.fire({
					icon: "success",
					text: "Successfully updated user.",
					timer: 1500,
				}).then((res) => {
					_users_table.bootstrapTable("refresh", { silent: true });
					// Reset add attendee modal
					$("#editUser #editUsername").val("");
					$("#editUser #editPassword").val("");
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
	$("#deleteUser #btnDeleteUser").click((e)=>{
		$.ajax({
			data: {
				user_id: $("#deleteUser").data('user-id'),
				username: $("#deleteUser").data('username')
			},
			dataType: "json",
			type: "post",
			url: "users/delete_user",
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
				$("#deleteUser").modal('hide');
				Swal.fire({
					icon: "success",
					text: "Successfully deleted user.",
					timer: 1500,
				}).then((res) => {
					_users_table.bootstrapTable("refresh", { silent: true });
				});
			},
			error: function (jqXHR, textStatus, errorThrown) {
				console.error(jqXHR);
				console.error(textStatus);
				console.error(errorThrown);
			},
		});
	});

	// RESET USER PASSWORD
	$("#resetUserPass #btnResetPassword").click((e)=>{
		$.ajax({
			data: {
				user_id: $("#resetUserPass").data('user-id'),
				username: $("#resetUserPass").data('username')
			},
			dataType: "json",
			type: "post",
			url: "users/reset_password",
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
				$("#resetUserPass").modal('hide');
				Swal.fire({
					icon: "success",
					text: "Successfully reset user password.",
					timer: 1500,
				}).then((res) => {
					_users_table.bootstrapTable("refresh", { silent: true });
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
