const data = [
	{
		slide_no: "1",
		url: "example.com/image_1",
	},
	{
		slide_no: "2",
		url: "example.com/image_1",
	},
];
const slideshow_table = $("#tblSlides");

function actionFormatter() {
	return [
		`<div class="btn-group" role="grid">\
			<button class="btn btn-danger btn-delete">\
        <i class="far fa-trash-alt"></i> <span class="hidden-sm hidden-xs">Delete</span>\
      </button>
    </div>`,
	].join("");
}

function slideNoFormatter(value, row, index) {
	return index + 1;
}

function imgUrlFormatter(value) {
	return `<img src="/uploads/slideshow/${value}" style="width: 200px; height: 200px;" />`;
}

window.operateEvents = {
	"click .btn-delete": function (e, value, row) {
		console.log(row);
		$("#deleteSlide").data('slide-url', row.url);
		$("#deleteSlide").data('slide-id', row.slideshow_id).modal("show");
	},
};

$(document).ready(() => {
	// $("#tblSlides").bootstrapTable({ data: data });
	slideshow_table.bootstrapTable({ 
		url: "/cms/slideshow/get_all",
	});

	// ADD
	$("#btnAddSlideImg").click((e)=>{
		$("#slideImg").click();
	});

	// On user select image
	$("#slideImg").change(function(e){
		let form_data = new FormData();

		form_data.append('url', $(this)[0].files[0]);
		$.ajax({
			data: form_data,
			dataType: "json",
			type: "post",
			processData: false,
			contentType: false,
			url: "/cms/slideshow/upload_image",
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
				Swal.fire({
					icon: "success",
					text: "Successfully uploaded slide.",
					timer: 1200,
				}).then((res) => {
					slideshow_table.bootstrapTable("refresh", { silent: true });
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
	$("#deleteSlide #btnDeleteSlide").click((e)=>{
		console.log($("#deleteSlide").data('slide-id'));
		$.ajax({
			data: {
				slideshow_id: $("#deleteSlide").data('slide-id'),
				url: $("#deleteSlide").data('slide-url')
			},
			dataType: "json",
			type: "post",
			url: "/cms/slideshow/delete_slide",
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
				$("#deleteSlide").modal('hide');
				Swal.fire({
					icon: "success",
					text: "Successfully deleted slide.",
					timer: 1200,
				}).then((res) => {
					slideshow_table.bootstrapTable("refresh", { silent: true });
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
