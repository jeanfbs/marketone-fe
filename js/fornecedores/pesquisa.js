define(['datatable', 'api'], function(datatable, api){

	$(function(){

		$("#insertHeader").load("../../fragmentos/menu-navegacao.html");

		var settings = {
			"bServerSide": true,
			"ajax":{
				"url":api["fornecedores.pesquisa"],
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
			"columns": [ 
				{ "name":"" },
				{ "name":"cdCpfCnpj" },
				{ "name":"razaoSocial" },
				{ "name":"nomeFantasia" },
				{ "name":"inscricaoMunicipal"},
				{ "name":"inscricaoEstadual"},
				{ "name":"email"},
				{ "name":"site"},
				{ "name":"status"}
			],	
			"columnDefs": [ 
				{"orderable": false, "targets": [0, 7]},
				{
					"targets": 0,
					"render": function(data, type, full, meta){
						data = full[1];
						return "<input type='checkbox' class='check-id' id=" + data + " value=" + data + ">";
					}
				}
			]
				
		};
		
		var userTable = new datatable.Table($("#tabela-fornecedores"), settings,[
			null,
			"http://localhost:8789/download/pdf",
			"http://localhost:8789/download/csv"
		]);
		userTable.show();
		
	});

});