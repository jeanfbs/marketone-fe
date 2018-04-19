
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

    $(document).ready(function(){
        
      $("#insertHeader").load("./fragments/header.html");

      var ajaxKnobDinheiro = Ajax.call(api["vendas.atual.dinheiro"], "GET");
      ajaxKnobDinheiro.done(function(json){
        
        knobVendasDinheiro = new chart.Knob("#vendas-dinheiro", json.value, formatter);

      }).fail(function(err){
        knobVendasDinheiro = new chart.Knob("#vendas-dinheiro");
      });
      
      
      var ajaxKnobCredito = Ajax.call(api["vendas.atual.credito"], "GET");
      ajaxKnobCredito.done(function(json){
        knobVendasCredito = new chart.Knob("#vendas-credito", json.value, formatter);
      }).fail(function(err){
        knobVendasCredito = new chart.Knob("#vendas-credito");
      });
      

      var ajaxKnobDebito = Ajax.call(api["vendas.atual.debito"], "GET");

      ajaxKnobDebito.done(function(json){
        knobVendasDebito = new chart.Knob("#vendas-debito", json.value, formatter);
      }).fail(function(err){
        knobVendasDebito = new chart.Knob("#vendas-debito");
      });

      var ajaxDonutAcumuloMes = Ajax.call(api["vendas.acumulo.mes"], "GET");

      ajaxDonutAcumuloMes.done(function(data){
        donutVendasAtuais = new chart.Donut('donut-vendas-atuais', data);
      }).fail(function(err){
        donutVendasAtuais = new chart.Donut('donut-vendas-atuais');
      });


      var ajaxBarSemanal = Ajax.call(api["vendas.semanal"], "GET");

      ajaxBarSemanal.done(function(data){
        chartBarVendasSemanal = new chart.BarChart("vendas-semanal", data, {
          barColors: ["#FFEB3B", "#FFC107", "#FF9800"],
          labels: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'],
  
        });
      }).fail(function(err){
        chartBarVendasSemanal = new chart.BarChart("vendas-semanal");
      });


      var ajaxBarMensal = Ajax.call(api["vendas.mensal"], "GET");

      ajaxBarMensal.done(function(data){
        chartBarVendasMensal = new chart.BarChart("vendas-mensal", data, {
          barColors: ["#FFEB3B", "#FFC107", "#FF9800","#FF5722" ],
          labels: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito','Total'],
  
        });
      }).fail(function(err){
        chartBarVendasMensal = new chart.BarChart("vendas-mensal");
      });

      /* Tab Estoque */

      var ajaxBarEstoqueAnual = Ajax.call(api["estoque.anual"], "GET");

      ajaxBarEstoqueAnual.done(function(data){
        chartBarEstoqueAnual = new chart.BarChart("estoque-anual", data, {
          barColors: ["#4CAF50", "#2196F3", "#FF9800","#FF5722" ],
          labels: ['Entradas', 'Saidas', 'Saldo Final','Total do Estoque'],
        });
        chartBarEstoqueAnual.show();
      }).fail(function(err){
        chartBarEstoqueAnual = new chart.BarChart("estoque-anual");
        chartBarEstoqueAnual.show();
      });

      var categoriaProduto = $("#categoria").select2({
          placeholder: "Categoria",
          allowClear: true,
          theme: "bootstrap"
      });

      $("#avaliarItem").off("click").on("click",function(){
          $("#td-tipo").text($("#inputConsulta").val() != "" ? 'Produto': 'Categoria');
          $("#td-produto").text(($("#inputConsulta").val() != "" ? 'Produto ' + Math.floor(10 * Math.random()): categoriaProduto.val()));
          
      });


      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("href");

          switch (target) {
            case "#vendas":

                knobVendasDinheiro.show();
                knobVendasCredito.show();
                knobVendasDebito.show();

                chartBarVendasSemanal.show();
                chartBarVendasMensal.show();

                donutVendasAtuais.show();
              break;

              case "#estoque":
                
                chartBarEstoqueAnual.show();

              break;
          }
      });

      $('[data-toggle="tooltip"]').tooltip();
    });
    


    var formatter = function (value) {
      return "R$ " + parseFloat(value).toLocaleString();
    };

});