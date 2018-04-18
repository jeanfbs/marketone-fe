
define(['chart'], function(chart){
    $(document).ready(function(){
        
        var knobVendasDinheiro = new chart.Knob("#vendas-dinheiro", 12756.65, formatter);
        var knobVendasCredito = new chart.Knob("#vendas-credito", Math.floor(1000 * Math.random()), formatter);
        var knobVendasDebito = new chart.Knob("#vendas-debito", Math.floor(10000 * Math.random()), formatter);
        
        $("#insertHeader").load("./fragments/header.html");

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

        var chartBarvendasMensal = new chart.BarChart("vendas-mensal",[
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


        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var target = $(e.target).attr("href");

            switch (target) {
              case "#vendas":

                  knobVendasDinheiro.show();
                  knobVendasCredito.show();
                  knobVendasDebito.show();

                  chartBarVendasSemanal.show();
                  chartBarvendasMensal.show();

                  donutVendasAtuais.show();
                break;

                case "#estoque":

                break;
            }
        });

        $('[data-toggle="tooltip"]').tooltip();


        var categoriaProduto = $("#categoria").select2({
            placeholder: "Escolha uma opção",
            allowClear: true,
            theme: "bootstrap"
        });

        $("#buscar-indicadores").off("click").on("click",function(){
            $("#td-tipo").text($("#inputConsulta").val() != "" ? 'Produto': 'Categoria');
            $("#td-produto").text(($("#inputConsulta").val() != "" ? 'Produto ' + Math.floor(10 * Math.random()): categoriaProduto.val()));
            $("#indicadoresForm").bootstrapValidator('revalidateField', 'categoria');
        });


        var boostrapValidationParameters = function(obj){

          obj = {
            "message": 'Este valor não é válido',
            "feedbackIcons": {
              "valid": '',
              "invalid": '',
              "validating": ''
            },
            "fields": obj.fields
        
          }
        
          return obj;
        };

        bootstrapParameters = boostrapValidationParameters({
          fields: {
              categoria: {
                  validators: {
                      notEmpty: {}
                  }
              }   
          }
      });

      var showMessageOnlyTime = function(e, data) {
        data.element
          .data('bv.messages')
          // Hide all the messages
          .find('.help-block[data-bv-for="' + data.field + '"]').hide()
          // Show only message associated with current validator
          .filter('[data-bv-validator="' + data.validator + '"]').show();
      }

      $("#indicadoresForm").bootstrapValidator(bootstrapParameters)
    .on('error.validator.bv', function(e, data){ showMessageOnlyTime(e, data)});


    });
    


    var formatter = function (value) {
      return "R$ " + parseFloat(value).toLocaleString();
    };

});