
define(['chart'], function(chart){
    $(document).ready(function(){
        
        var formatter = function (value) {
          return "R$ " + parseFloat(value).toLocaleString();
        };
        var vendasDinheiro = new chart.Knob("#vendas-dinheiro", 12756.65, formatter);
        vendasDinheiro.show();

        var vendasCredito = new chart.Knob("#vendas-credito", Math.floor(1000 * Math.random()), formatter);
        vendasCredito.show();

        var vendasDebito = new chart.Knob("#vendas-debito", Math.floor(10000 * Math.random()), formatter);
        vendasDebito.show();
        
        $("#insertHeader").load("./fragments/header.html");

        var donut = new chart.Donut('donut-vendas-atuais', [
          { label: 'Dinheiro', value: 33389.40 },
          { label: 'Crédito', value: 87389.54 },
          { label: 'Débito', value: 29689.49 },
        ]);

        donut.show();

        var vendasSemanal = new chart.BarChart("vendas-semanal",[
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

        var vendasMensal = new chart.BarChart("vendas-mensal",[
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
          var target = $(e.target).attr("href") // activated tab

            switch (target) {
              case "#vendas":
                  vendasSemanal.show();
                  vendasMensal.show();
                break;

                case "#estoque":

                break;
            }
        });

        $('[data-toggle="tooltip"]').tooltip();

    });

});