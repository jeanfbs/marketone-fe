
define(['chart', 'ajax', 'api'], function(Chart, Ajax, api){

  $("#insertHeader").load("../fragmentos/menu-navegacao.html");
    
    
    var Utils = {
      getFormParameters: function _getFormParameters(form){
        var formParams = {};
        $.each(form.serializeArray(), function(_, kv) {
          formParams[kv.name] = kv.value;
        });
        return formParams;
      },
      
      formatter: function _formatter(value) {
        
        return "R$ " + parseFloat(value).toLocaleString();
      }
    };

    $(function(){
        
      $("#insertHeader").load("../fragmentos/menu-navegacao.html");

      var ajaxKnobDinheiro = new Ajax.WebClient(api["vendas.atual.dinheiro"], "GET");
      
      ajaxKnobDinheiro.call().done(function(json){
        
        knobVendasDinheiro = new Chart.Knob("#vendas-dinheiro", json.value, Utils.formatter);

      }).fail(function(err){
        knobVendasDinheiro = new Chart.Knob("#vendas-dinheiro");
      }).always(function(){
          knobVendasDinheiro.show();
      });
      
      
      var ajaxKnobCredito = new Ajax.WebClient(api["vendas.atual.credito"], "GET");
      
      ajaxKnobCredito.call().done(function(json){
        knobVendasCredito = new Chart.Knob("#vendas-credito", json.value, Utils.formatter);
      }).fail(function(err){
        knobVendasCredito = new Chart.Knob("#vendas-credito");
      }).always(function(){
          knobVendasCredito.show();
      });
      

      var ajaxKnobDebito = new Ajax.WebClient(api["vendas.atual.debito"], "GET");
      

      ajaxKnobDebito.call().done(function(json){
        knobVendasDebito = new Chart.Knob("#vendas-debito", json.value, Utils.formatter);
      }).fail(function(err){
        knobVendasDebito = new Chart.Knob("#vendas-debito");
      }).always(function(){
          knobVendasDebito.show();
      });

      var ajaxDonutAcumuloMes = new Ajax.WebClient(api["vendas.acumulo.mes"], "GET");
      

      ajaxDonutAcumuloMes.call().done(function(data){
        donutVendasAtuais = new Chart.Donut('donut-vendas-atuais', data, Chart.COLORS.donutColors);
      }).fail(function(err){
        donutVendasAtuais = new Chart.Donut('donut-vendas-atuais');
      }).always(function(){
          donutVendasAtuais.show();
      });


      var ajaxBarSemanal = new Ajax.WebClient(api["vendas.semanal"], "GET");
      
      ajaxBarSemanal.call().done(function(data){
        chartBarVendasSemanal = new Chart.BarChart("vendas-semanal", data, {
          barColors: Chart.COLORS.barColors.slice(0, 3),
          labels: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'],
  
        });
      }).fail(function(err){
        chartBarVendasSemanal = new Chart.BarChart("vendas-semanal");
      }).always(function(){
          chartBarVendasSemanal.show();
      });


      var ajaxBarMensal = new Ajax.WebClient(api["vendas.mensal"], "GET");
      
      ajaxBarMensal.call().done(function(data){
        chartBarVendasMensal = new Chart.BarChart("vendas-mensal", data, {
          barColors: Chart.COLORS.barColors,
          labels: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito','Total'],
  
        });
      }).fail(function(err){
        chartBarVendasMensal = new Chart.BarChart("vendas-mensal");
      }).always(function(){
          chartBarVendasMensal.show();
      });

      /* Tab Estoque */

      var ajaxBarEstoqueAnual = new Ajax.WebClient(api["estoque.anual"], "GET");
      
      ajaxBarEstoqueAnual.call().done(function(data){
        chartBarEstoqueAnual = new Chart.BarChart("estoque-anual", data, {
          barColors: Chart.COLORS.barColors,
          labels: ['Entradas', 'Saidas', 'Saldo Final','Total do Estoque'],
        });
      }).fail(function(err){
        chartBarEstoqueAnual = new Chart.BarChart("estoque-anual");
      }).always(function(){
        var today = new Date();
        var lbPeriodoAnual = "01/2018 até " + ("0" + (today.getMonth() + 1)).slice(-2) + "/" + today.getFullYear();
        $("#lbPeriodoAnual").text(lbPeriodoAnual);
      });


      var categoriaProduto = $("#categoria").select2({
          placeholder: "Categoria",
          allowClear: true,
          theme: "bootstrap"
      });

      $("#buscarIndicadoresEstoque").off("click").on("click",function(){

        var formParamsObj = Utils.getFormParameters($("#indicadoresForm"));
        var ajaxBuscaIndicadoresEstoque = new Ajax.WebClient(api["estoque.indicadores.periodo"], "GET", formParamsObj);
        
        ajaxBuscaIndicadoresEstoque.call().done(function(response){

          $("#ajaxBuscaIndicadoresEstoqueError").addClass("hide");
          $("#divIndicadores").hide().removeClass("hide").fadeIn(500);
          $("#spanMediaEstoque").text(response.media.toLocaleString());
          $("#spanCoberturaEstoque").text(response.cobertura);
          $("#spanGiroEstoque").text(response.giro);
          $("#spanTempoReposicao").text(response.tempo_reposicao);

        }).fail(function(err){
            $("#ajaxBuscaIndicadoresEstoqueError").removeClass("hide");
            $("#divIndicadores").addClass("hide");
        });

    });

      $("#avaliarItem").off("click").on("click",function(){
          
          var formParamsObj = Utils.getFormParameters($("#indicadoresProdutoCategoriaForm"));
          var ajaxBuscaIndicadoresEstoque = new Ajax.WebClient(api["estoque.indicadores.periodo.item"], "GET", formParamsObj);
          
          ajaxBuscaIndicadoresEstoque.call().done(function(response){

            $("#ajaxBuscaIndicadoresEstoqueItemError").addClass("hide");
            $("#divIndicadoresItem").hide().removeClass("hide").fadeIn(500);

            $("#td-tipo").text(response.tipo);
            $("#td-produto").text(response.item);
            $("#td-quantidade").text(response.quantidade_atual);
            $("#td-unidade").text(response.unidade);
            $("#td-atualizacao").text(response.atualizacao);

            $("#spanMediaEstoqueItem").text(response.media.toLocaleString());
            $("#spanCoberturaEstoqueItem").text(response.cobertura);
            $("#spanGiroEstoqueItem").text(response.giro);
            $("#spanTempoReposicaoItem").text(response.tempo_reposicao);
            

          }).fail(function(err){
              $("#ajaxBuscaIndicadoresEstoqueItemError").removeClass("hide");
              $("#divIndicadoresItem").addClass("hide");
          });

      });



      // Tab Financeiro

      var ajaxLineMensal = new Ajax.WebClient(api["faturamento.mensal"], "GET");
      

      ajaxLineMensal.call().done(function(data){
        chartLineFaturamentoMensal = new Chart.LineChart("faturamento-mensal", data, {
          lineColors: Chart.COLORS.barColors.slice(0, 2),
          labels: ['Faturamento', 'Lucro Líquido'],
  
        });
      }).fail(function(err){
        chartLineFaturamentoMensal = new Chart.LineChart("faturamento-mensal");
      });


      $('#dashTabs').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");

          switch (target) {
              case "#estoque":
                chartBarEstoqueAnual.show();
              break;
              case "#financeiro":
                chartLineFaturamentoMensal.show();
              break;
          }
      });
    });
});