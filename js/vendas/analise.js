define(['chart', 'ajax', 'api'], function(Chart, Ajax, api){

	$(function(){

		$("#insertHeader").load("../../fragmentos/menu-navegacao.html");
		

		var ajaxVolumePeriodo = new Ajax.WebClient(api["vendas.analise"], "GET");
      
		ajaxVolumePeriodo.call().done(function(data){
			chartBarVolumePeriodo = new Chart.BarChart("vendasPeriodo", data, {
			barColors: ["#009688"],
			labels: ['Total']
			});
		}).fail(function(err){
			chartBarVolumePeriodo = new Chart.BarChart("vendasPeriodo");
		}).always(function(){
			chartBarVolumePeriodo.show();
		});
	});

});