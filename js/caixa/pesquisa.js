define(['datatable', 'api'], function(datatable, api){

	$(function(){

		$("#insertHeader").load("../../fragmentos/menu-navegacao.html");
		
		var settings = {
			"bServerSide": true,
			"ajax":{
				"url":api["fechamentos.pesquisa"],
				"type":"GET",
				"data":function(d){
					d.search = [];
					d.search[0] = {
						filter: "idCaixa",
						value: $("#idCaixa option:selected").val()
						
					};
					d.search[1] = {
						filter: "data" ,
						value: $("#dataInicial").val()
						
					};
					d.search[2] = {
						filter: "data" ,
						value: $("#dataFinal").val()
						
					};
				},
			},
			"columnDefs": [ 
				{"orderable": false, "targets": 0},
				{
					"targets": 0,
					"render": function(data, type, full, meta){
						data = full[1];
						return '<a href="#" class="detailIcon"> '+
						'         <i  class="fa fa-plus-circle fa-fw plus" aria-hidden="true"></i>'+
						'         <i class="fa fa-minus-circle fa-fw text-danger hide minus" aria-hidden="true"></i>'+
						'       </a>';
					}
				}
			]
				
		};
		
		var tabelaFechamentos = new datatable.Table($("#tabelaFechamentos"), settings,[
			null,
			null,
			"http://localhost:8789/download"
		]);
		tabelaFechamentos.show();
	
		$(document).off("click", ".detailIcon").on("click", ".detailIcon", function(e){
			e.preventDefault();
			var tr = $(this).closest('tr');
			
			var detailRows = [];
			
			var row = tabelaFechamentos.getDT().row( tr );
			var idx = $.inArray( tr.attr('id'), detailRows );

			if ( row.child.isShown() ) {
				$(this).find(".plus").removeClass("hide");
				$(this).find(".minus").addClass("hide");
				tr.removeClass("selected");
				row.child.hide();
	
				// Remove from the 'open' array
				detailRows.splice( idx, 1 );
			}
			else {
				$(this).find(".plus").addClass("hide");
				$(this).find(".minus").removeClass("hide");
				tr.addClass("selected");
				row.child( format( row.data() ) ).show();
	
				// Add to the 'open' array
				if ( idx === -1 ) {
					detailRows.push( tr.attr('id') );
				}
			}
		});

		function format ( d ) {
			
			var html = '<table class="table table-condensed table-simple-bordered">'+
'						 <caption> Movimentações Efetuadas</caption>'+
'                        <thead>'+
'                            <tr class="active">'+
'                                <th>Horário</th>'+
'                                <th>Total das Entradas</th>'+
'                                <th>Dinheiro</th>'+
'                                <th>Crédito</th>'+
'                                <th>Débito</th>'+
'                                <th>Saída</th>'+
'                                <th>Tipo</th>'+
'                            </tr>'+
'                        </thead>'+
'                        <tbody>'+
'                            <tr>'+
'                                <td>12/12/12 12:40</td>'+
'                                <td>123.41</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>0.00</td>'+
'                                <td>VENDA</td>'+
'                            </tr>'+
'                            <tr>'+
'                                <td>12/12/12 12:40</td>'+
'                                <td>123.41</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>0.00</td>'+
'                                <td>VENDA</td>'+
'                            </tr>'+
'                            <tr>'+
'                                <td>12/12/12 12:40</td>'+
'                                <td>123.41</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>0.00</td>'+
'                                <td>VENDA</td>'+
'                            </tr>'+
'                            <tr>'+
'                                <td>12/12/12 12:40</td>'+
'                                <td>123.41</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>0.00</td>'+
'                                <td>VENDA</td>'+
'                            </tr>'+
'                            <tr>'+
'                                <td>12/12/12 12:40</td>'+
'                                <td>123.41</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>12.21</td>'+
'                                <td>0.00</td>'+
'                                <td>VENDA</td>'+
'                            </tr>'+
'                        </tbody>'+
'                    </table>';
	
			return html;
		}

		$('#input-search').on("keyup",function(e) {
			tabelaFechamentos.redraw();
		});
	
		$('#btn-search').on("click",function(){
			tabelaProdutos.redraw();
		});
		
	});

});