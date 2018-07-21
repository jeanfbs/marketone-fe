define(['datatable', 'api'], function(datatable, api){

	$(function(){

		$("#insertHeader").load("../../fragmentos/menu-navegacao.html");

		var settings = {
			"bServerSide": true,
			"ajax":{
				"url":api["produtos.pesquisa"],
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
				{"orderable": false, "targets": [0, 9]},
				{
					"targets": 0,
					"render": function(data, type, full, meta){
						data = full[1];
						return "<input type='checkbox' class='check-id' id=" + data + " value=" + data + ">";
					}
				}
			]
				
		};
		
		var tabelaProdutos = new datatable.Table($("#tabela-produtos"), settings,[
			null,
			null,
			"http://localhost:8789/download"
		]);
		tabelaProdutos.show();
	
		$('#input-search').on("keyup",function(e) {
			tabelaProdutos.redraw();
		});
	
		$('#btn-search').on("click",function(){
			tabelaProdutos.redraw();
		});
		
	});

});