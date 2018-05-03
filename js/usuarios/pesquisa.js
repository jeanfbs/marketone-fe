define(['datatable', 'api'], function(datatable, api){

	$(function(){

		$("#insertHeader").load("../../fragmentos/menu-navegacao.html");

		var settings = {
			"bServerSide": true,
			"ajax":{
				"url":api["usuarios.pesquisa"],
				"type":"GET",
				"data":function(d){
					d.search = [];
					d.search[0] = {
						filter: $("#filter option:selected").val() ,
						value: $(".input-search").val()
						
					};
					d.search[1] = {
						filter: "status" ,
						value: $("#status option:selected").val()
					};
				},
			},
			"columnDefs": [ 
				{"orderable": false, "targets": [0, 5]},
				{
					"targets": 0,
					"render": function(data, type, full, meta){
						data = full[1];
						return "<input type='checkbox' class='check-id' id=" + data + " value=" + data + ">";
					}
				}
			]
				
		};
		
		var userTable = new datatable.Table($("#tabela-usuarios"), settings,[
			null,
			"http://localhost:8789/download",
			"http://localhost:8789/download"
		]);
		userTable.show();
	
		$('#input-search').on("keyup",function(e) {
			userTable.redraw();
		});
	
		$('#btn-search').on("click",function(){
			userTable.redraw();
		});
		
	});

});