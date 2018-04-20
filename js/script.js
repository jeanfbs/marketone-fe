
define(['chart', 'api'], function(chart, api){

    var Ajax = {

      call: function(url, method, data){
        var settings = {
            crossDomain: true,
            headers: {
              "content-type": "application/json",
              "cache-control": "no-cache"
            },
            dataType: 'json',
        };
        
        settings.url = url;
        settings.method = method;
        if(data != undefined && data != null){
          settings.data = data;
        }

        return $.ajax(settings);
      }
    };

    var Utils = {
      getFormParameters: function(form){
        var formParams = {};
        $.each(form.serializeArray(), function(_, kv) {
          formParams[kv.name] = kv.value;
        });
        return formParams;
      }
    };

    $(function(){
        
      $("#insertHeader").load("./fragments/header.html");

      var ajaxKnobDinheiro = Ajax.call(api["vendas.atual.dinheiro"], "GET");
      ajaxKnobDinheiro.done(function(json){
        
        knobVendasDinheiro = new chart.Knob("#vendas-dinheiro", json.value, formatter);

      }).fail(function(err){
        knobVendasDinheiro = new chart.Knob("#vendas-dinheiro");
      }).always(function(){
          knobVendasDinheiro.show();
      });
      
      
      var ajaxKnobCredito = Ajax.call(api["vendas.atual.credito"], "GET");
      ajaxKnobCredito.done(function(json){
        knobVendasCredito = new chart.Knob("#vendas-credito", json.value, formatter);
      }).fail(function(err){
        knobVendasCredito = new chart.Knob("#vendas-credito");
      }).always(function(){
          knobVendasCredito.show();
      });
      

      var ajaxKnobDebito = Ajax.call(api["vendas.atual.debito"], "GET");

      ajaxKnobDebito.done(function(json){
        knobVendasDebito = new chart.Knob("#vendas-debito", json.value, formatter);
      }).fail(function(err){
        knobVendasDebito = new chart.Knob("#vendas-debito");
      }).always(function(){
          knobVendasDebito.show();
      });

      var ajaxDonutAcumuloMes = Ajax.call(api["vendas.acumulo.mes"], "GET");

      ajaxDonutAcumuloMes.done(function(data){
        donutVendasAtuais = new chart.Donut('donut-vendas-atuais', data);
      }).fail(function(err){
        donutVendasAtuais = new chart.Donut('donut-vendas-atuais');
      }).always(function(){
          donutVendasAtuais.show();
      });


      var ajaxBarSemanal = Ajax.call(api["vendas.semanal"], "GET");

      ajaxBarSemanal.done(function(data){
        chartBarVendasSemanal = new chart.BarChart("vendas-semanal", data, {
          barColors: ["#FFEB3B", "#FFC107", "#FF9800"],
          labels: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'],
  
        });
      }).fail(function(err){
        chartBarVendasSemanal = new chart.BarChart("vendas-semanal");
      }).always(function(){
          chartBarVendasSemanal.show();
      });


      var ajaxBarMensal = Ajax.call(api["vendas.mensal"], "GET");

      ajaxBarMensal.done(function(data){
        chartBarVendasMensal = new chart.BarChart("vendas-mensal", data, {
          barColors: ["#FFEB3B", "#FFC107", "#FF9800","#FF5722" ],
          labels: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito','Total'],
  
        });
      }).fail(function(err){
        chartBarVendasMensal = new chart.BarChart("vendas-mensal");
      }).always(function(){
          chartBarVendasMensal.show();
      });

      /* Tab Estoque */

      var ajaxBarEstoqueAnual = Ajax.call(api["estoque.anual"], "GET");

      ajaxBarEstoqueAnual.done(function(data){
        chartBarEstoqueAnual = new chart.BarChart("estoque-anual", data, {
          barColors: ["#4CAF50", "#2196F3", "#FF9800","#FF5722" ],
          labels: ['Entradas', 'Saidas', 'Saldo Final','Total do Estoque'],
        });
      }).fail(function(err){
        chartBarEstoqueAnual = new chart.BarChart("estoque-anual");
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
        var ajaxBuscaIndicadoresEstoque = Ajax.call(api["estoque.indicadores.periodo"], "GET", formParamsObj);
        
        ajaxBuscaIndicadoresEstoque.done(function(response){

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
          var ajaxBuscaIndicadoresEstoque = Ajax.call(api["estoque.indicadores.periodo.item"], "GET", formParamsObj);
          
          ajaxBuscaIndicadoresEstoque.done(function(response){

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

      var ajaxLineMensal = Ajax.call(api["faturamento.mensal"], "GET");

      ajaxLineMensal.done(function(data){
        chartLineFaturamentoMensal = new chart.LineChart("faturamento-mensal", data, {
          lineColors: ["#FFEB3B", "#FF5722"],
          labels: ['Faturamento', 'Lucro Líquido'],
  
        });
      }).fail(function(err){
        chartLineFaturamentoMensal = new chart.LineChart("faturamento-mensal");
      });


      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");

          switch (target) {
            case "#vendas":

                
              break;

              case "#estoque":
                
                chartBarEstoqueAnual.show();

              break;

              case "#financeiro":
                
                chartLineFaturamentoMensal.show();
              
              break;
          }
      });

      $('[data-toggle="tooltip"]').tooltip();
    });
    


    var formatter = function (value) {
      return "R$ " + parseFloat(value).toLocaleString();
    };

});