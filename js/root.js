$(function(){

	var url = window.location;
	var element = $('ul.navbar-nav > li > a').filter(function() {
		var index = url.href.indexOf(this.href);
		return index == 0;
	}).parent().addClass('active');

    $('[data-toggle="tooltip"]').tooltip();
    $('.select2-estados').select2({
        placeholder: "Selecione uma opção",
		allowClear: true,
		theme: "bootstrap"
	});
		

    /*
    *	Select all rows of datatable with highlight, also enable and disabled the control buttons  
    */
   $(document).off("click","#all").on("click","#all",function(){
        var table  = $(this).parents(".dataTables_scroll");
        
        btn_new = $("#controls").find("#new");
        btn_view = $("#controls").find("#view");
        btn_delete = $("#controls").find("#delete");

        if(!$(this).hasClass('selected')){
            btn_new.addClass("disabled");
            btn_view.addClass("disabled");
            $(this).addClass('selected');
            if(tableHasResults(table)){
                btn_delete.removeClass("disabled");
            }
            table.find("tbody tr").each(function(index, row) {
                $(row).addClass('primary');
                checkbox = $(row).children("td:eq(0)").find("input[type=checkbox]");
                checkbox.prop("checked",true);
            });
        }
        else{
            $(this).removeClass('selected');
            btn_delete.addClass("disabled");
            btn_view.addClass("disabled");
            table.find("tbody tr").each(function(index, row) {
                $(row).removeClass('primary');
                checkbox = $(row).children("td:eq(0)").find("input[type=checkbox]");
                checkbox.prop("checked",false);				
            });

            tt_check = $(".check-id:checked").length;
            if(tt_check == 1){
                btn_view.removeClass("disabled");	
            }
            if(tt_check == 0){
                btn_new.removeClass("disabled");
            }
        }
    });

	$("#mostrar-senha").change(function(){
        if($(this).is(":checked")){
            $(".password").attr("type","text");
        }
        else{
            $(".password").attr("type","password");
        }
    });

    /*
	*	Handler for each checkbox of the datatable also enable and disabled the control buttons 
	*/
	checkboxSelector = ".table-datatable tr td input[type=checkbox]";
	$(document).off("click",checkboxSelector)
	.on("click",checkboxSelector,function(e){

			allChecks = $("tbody tr td input[type=checkbox]");
			allChecked = $("tbody tr td input[type=checkbox]:checked");

			
			if(allChecks.length != allChecked.length) {
					$("#all").prop('checked', false);
					$("#all").removeClass('selected');
			}
			else{
				$("#all").prop('checked', true);
				$("#all").addClass('selected');
			}

			var row = $(this).parents("tr");
			if(allChecked.length == 1){
				cpf = allChecked[0].value;
				var href = $("#controls").find("#view").attr("base-view-url");
				$("#controls").find("#view").attr("href", href + cpf);
			}

			btn_new = $("#controls").find("#new");
			btn_view = $("#controls").find("#view");
			btn_delete = $("#controls").find("#delete");
			if(!row.hasClass('primary')){
				row.addClass('primary');
				checkbox = $(this);
				checkbox.prop("checked",true);

				
				btn_new.addClass("disabled");
				if(allChecked.length > 1){
					btn_view.addClass("disabled");
				}
				else{
					btn_view.removeClass("disabled");
					btn_delete.removeClass("disabled");
				}
				
			}
			else{
				
				if(allChecked.length <= 1){
					btn_view.removeClass("disabled");
					btn_delete.removeClass("disabled");
				}
				if(allChecked.length == 0){
					btn_new.removeClass("disabled");
					btn_view.addClass("disabled");
					btn_delete.addClass("disabled");
				}
				row.removeClass('primary');
				checkbox = $(this);
				checkbox.prop("checked",false);
			}
			

	});

	var tableHasResults = function(table){

		td = table.find("tbody tr:first td");
		return !td.is("[colspan]");
	};
});