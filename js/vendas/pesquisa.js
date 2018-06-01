define(['datatable', 'api'], function(datatable, api){

	$(function(){

		$("#insertHeader").load("../../fragmentos/menu-navegacao.html");

		var settings = {
			"bServerSide": true,
			"ajax":{
				"url":api["vendas.pesquisa"],
				"type":"GET",
				"data":function(d){
					d.search = [];
					d.search[0] = {
						filter: "data" ,
						value: $("#dataInicial").val()
						
					};
	
					d.search[1] = {
						filter: "data" ,
						value: $("#dataFinal").val()
						
					};
	
					d.search[2] = {
						filter: "valor" ,
						value: $("#valorMinimo").val()
						
					};
	
					d.search[3] = {
						filter: "valor" ,
						value: $("#valorMaximo").val()
						
					};

					d.search[4] = {
						filter: "status" ,
						value: $("#status").val()
						
					};

					d.search[5] = {
						filter: "tipoPagamento" ,
						value: $("#tipoPagamento").val()
						
					};

					d.search[6] = {
						filter: "cliente" ,
						value: $("#busca-cliente").val()
						
					};

					d.search[7] = {
						filter: "multiplosPagamentos" ,
						value: $("#multiplosPagamentos").val()
						
					};

					d.search[8] = {
						filter: "desconto" ,
						value: $("#desconto").val()
						
					};

					d.search[9] = {
						filter: "nota" ,
						value: $("#busca-nota").val()
						
					};

					d.search[10] = {
						filter: "produtos" ,
						value: $("#busca-produtos").val()
					};
				},
			},
			"columns": [ 
				{ "name":"codigo" },
				{ "name":"data" },
				{ "name":"valor" },
				{ "name":"numNotaFiscal"},
				{ "name":"totalItens"},
				{ "name":"multiplosPagamentos"},
				{ "name":"desconto"},
				{ "name":"status"},
			],
			"columnDefs": [ 
				{"orderable": false, "targets": [0, 8]},
				{
					"targets": 0,
					"render": function(data, type, full, meta){
						data = full[1];
						return "<input type='checkbox' class='check-id' id=" + data + " value=" + data + ">";
					}
				}
			]
				
		};
		
		var tabelaVendas = new datatable.Table($("#tabela-vendas"), settings,[
			"http://localhost:8789/download/excel",
			"http://localhost:8789/download/pdf",
			"http://localhost:8789/download/csv"
		]);
		tabelaVendas.show();
		$('#btn-search').on("click",function(){
			tabelaVendas.redraw();
		});
		
	});

});