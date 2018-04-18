
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

        var ajaxObject = Ajax.call(api["vendas.atual.dinheiro"], "GET");

        var knobVendasDinheiro = null;

        ajaxObject.done(function(json){
          
          knobVendasDinheiro = new chart.Knob("#vendas-dinheiro", json.value, formatter);

        }).fail(function(err){
          console.log(err.responseText);
        });
        
        
        ajaxObject = Ajax.call(api["vendas.atual.credito"], "GET");

        var knobVendasCredito = null;

        ajaxObject.done(function(json){
          
          knobVendasCredito = new chart.Knob("#vendas-credito", json.value, formatter);
          
        }).fail(function(err){
          console.log(err.responseText);
        });
        

        ajaxObject = Ajax.call(api["vendas.atual.debito"], "GET");

        var knobVendasDebito = null;

        ajaxObject.done(function(json){
          console.log(json);
          
          knobVendasDebito = new chart.Knob("#vendas-debito", json.value, formatter);
          
        }).fail(function(err){
          console.log(err.responseText);
        });

        var donutVendasAtuais = new chart.Donut('donut-vendas-atuais', [
          { label: 'Dinheiro', value: 33389.40 },
          { label: 'Crédito', value: 87389.54 },
          { label: 'Débito', value: 29689.49 },
        ]);

        var chartBarVendasSemanal = new chart.BarChart("vendas-semanal",[
          { y: '02/06', dinheiro: 1254, credito: 55.21, debito: 100 },
          { y: '03/06', dinheiro: 152.54,  credito: 125, debito: 205 },
          { y: '04/06', dinheiro: 50,  credito: 454, debito: 2120 },
          { y: '05/06', dinheiro: 3678.12,  credito: 3342.67, debito: 490 },
          { y: '08/06', dinheiro: 242,  credito: 2817, debito: 809 },
          { y: '09/06', dinheiro: 1544.65,  credito: 89, debito: 550.66 },
          { y: '10/06', dinheiro: 100, credito: 1209, debito: 2779 }
        ],
        {
          barColors: ["#FFEB3B", "#FFC107", "#FF9800"],
          labels: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito'],
  
        });

        var chartBarVendasMensal = new chart.BarChart("vendas-mensal",[
          { y: '02/06', dinheiro: 1254, credito: 55.21, debito: 100, total:  (1254 + 55.21 + 100)},
          { y: '03/06', dinheiro: 152.54,  credito: 125, debito: 205 , total: (152.54 + 125 + 205)},
          { y: '04/06', dinheiro: 50,  credito: 454, debito: 2120 , total: (50 + 454 + 2120)},
          { y: '05/06', dinheiro: 3678.12,  credito: 3342.67, debito: 490 , total: (3678.12 + 3342.67 + 490)},
          { y: '08/06', dinheiro: 242,  credito: 2817, debito: 809, total: (242 + 2817 + 809) },
          { y: '09/06', dinheiro: 1544.65,  credito: 89, debito: 550.66, total: (1544.65 + 89 + 550.66)},
          { y: '10/06', dinheiro: 100, credito: 1209, debito: 2779, total: (100 + 1209 + 2779) },
          { y: '02/06', dinheiro: 1254, credito: 55.21, debito: 100, total:  (1254 + 55.21 + 100)},
          { y: '03/06', dinheiro: 152.54,  credito: 125, debito: 205 , total: (152.54 + 125 + 205)},
          { y: '04/06', dinheiro: 50,  credito: 454, debito: 2120 , total: (50 + 454 + 2120)},
          { y: '05/06', dinheiro: 3678.12,  credito: 3342.67, debito: 490 , total: (3678.12 + 3342.67 + 490)},
          { y: '08/06', dinheiro: 242,  credito: 2817, debito: 809, total: (242 + 2817 + 809) },
          { y: '09/06', dinheiro: 1544.65,  credito: 89, debito: 550.66, total: (1544.65 + 89 + 550.66)},
          { y: '10/06', dinheiro: 100, credito: 1209, debito: 2779, total: (100 + 1209 + 2779) },
          { y: '02/06', dinheiro: 1254, credito: 55.21, debito: 100, total:  (1254 + 55.21 + 100)},
          { y: '03/06', dinheiro: 152.54,  credito: 125, debito: 205 , total: (152.54 + 125 + 205)},
          { y: '04/06', dinheiro: 50,  credito: 454, debito: 2120 , total: (50 + 454 + 2120)},
          { y: '05/06', dinheiro: 3678.12,  credito: 3342.67, debito: 490 , total: (3678.12 + 3342.67 + 490)},
          { y: '08/06', dinheiro: 242,  credito: 2817, debito: 809, total: (242 + 2817 + 809) },
          { y: '09/06', dinheiro: 1544.65,  credito: 89, debito: 550.66, total: (1544.65 + 89 + 550.66)},
          { y: '10/06', dinheiro: 100, credito: 1209, debito: 2779, total: (100 + 1209 + 2779) }
        ],
        {
          barColors: ["#FFEB3B", "#FFC107", "#FF9800","#FF5722" ],
          labels: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito','Total'],
  
        });


        /* Tab Estoque */

        var chartBarEstoqueAnual = new chart.BarChart("estoque-anual",[
          { y: '01/2018', entradas: 1254, saidas: 55, saldo: 100, valorTotal:  (1254 + 55.21 + 100)},
          { y: '02/2018', entradas: 152,  saidas: 125, saldo: 205 , valorTotal: (152.54 + 125 + 205)},
          { y: '03/2018', entradas: 50,  saidas: 454, saldo: 2120 , valorTotal: (50 + 454 + 2120)},
          { y: '04/2018', entradas: 3678,  saidas: 3342, saldo: 490 , valorTotal: (3678.12 + 3342.67 + 490)},
          { y: '05/2018', entradas: 242,  saidas: 2817, saldo: 809, valorTotal: (242 + 2817 + 809) },
          { y: '06/2018', entradas: 1544,  saidas: 89, saldo: 550, valorTotal: (1544.65 + 89 + 550.66)},
          { y: '17/2018', entradas: 100, saidas: 1209, saldo: 2779, valorTotal: (100 + 1209 + 2779) },
          { y: '08/2018', entradas: 1254, saidas: 55, saldo: 100, valorTotal:  (1254 + 55.21 + 100)},
          { y: '09/2018', entradas: 152,  saidas: 125, saldo: 205 , valorTotal: (152.54 + 125 + 205)},
          { y: '10/2018', entradas: 50,  saidas: 454, saldo: 2120 , valorTotal: (50 + 454 + 2120)},
          { y: '11/2018', entradas: 3678,  saidas: 3342, saldo: 490 , valorTotal: (3678.12 + 3342.67 + 490)},
          { y: '12/2018', entradas: 242,  saidas: 2817, saldo: 809, valorTotal: (242 + 2817 + 809) },
        ],
        {
          barColors: ["#4CAF50", "#2196F3", "#FF9800","#FF5722" ],
          labels: ['Entradas', 'Saidas', 'Saldo Final','Total do Estoque'],
  
        });

        chartBarEstoqueAnual.show();


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