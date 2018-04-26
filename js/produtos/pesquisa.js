define(['datatable', 'api'], function(datatable, api){

    $("#insertHeader").load("../../fragments/header.html");


    var planify = function(data) {
        for (var i = 0; i < data.columns.length; i++) {
            column = data.columns[i];
            column.searchRegex = column.search.regex;
            column.searchValue = column.search.value;
            delete(column.search);
        }
    };

    var settings = {
		"bServerSide": true,
		"ajax":{
			"url":api["usuario.pesquisa"],
			"type":"POST",
			"data":function(d){
				delete d.search;
				// d.search = [];
				// d.search[0] = {
				// 	filter: $("#filter option:selected").val() ,
				// 	value: $(".input-search").val()
					
				// };
				// d.search[1] = {
				// 	filter: "status" ,
				// 	value: $("#status option:selected").val()
                // };
                // TODO o payload do mock está faltando os parametros de resposta do datatable
                // _iRecordsTotal, _iRecordsDisplay
				planify(d);
			},
		},
		"columns": [ 
			{ "orderable": false },
			{ "name":"cpf" },
			{ "name":"nome" },
			{ "name":"email" },
			{ "orderable": false, "name":"cargo"},
			{ "orderable": false, "name":"status"},
		],
		"columnDefs": [ {
			"targets": 0,
			"render": function(data, type, full, meta){
				data = full[1];
				return "<input type='checkbox' class='check-id' id=" + data + " value=" + data + ">";
			}
		} ]
			
    };
    
    var userTable = new datatable.Table($(".table-datatable"), settings);
    userTable.show();

    // dataTable = $(".table-datatable").DataTable(settings);
    

    $('.input-search').on("keyup",function(e) {
		dataTable.draw();
	});

	$('.btn-search').on("click",function(){
		dataTable.draw();
	});

});