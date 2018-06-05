define(['ajax', 'api'], function(Ajax, api){

    var BuscaProdutos = {

        formatItem : function (response) {
            if (response.loading) {
                return response.text;
            }
            var markup = "<div class='row'>"+
                "<div class='col-sm-1'>"+
                    "<img src='"+ response.imagem +"' width='75px'>"+
                "</div>"+
                "<div class='col-sm-11'>"+
                    "<span class='select2-produto'>"+ response.descricao +"</span><br>"+
                    "<span class='select2-info'><strong>Categoria:</strong> "+ response.categoria +"</span>"+
                    "<span class='select2-info'><strong>Marca:</strong> "+ response.marca +"</span>"+
                    "<span class='select2-info'><strong>Unidade:</strong> "+ response.medida +"</span>"+
                "</div>"+
            "</div>";
          
            return markup;
          },

          formatItemSelection : function (item) {
            $("#spanCodigoBarra").text(item.codigoBarra);
            item.valorUnitario = isNaN(item.valorUnitario) ? 0.0 : item.valorUnitario;
            
            $("#spanValorUnitario").attr("data-valor-unitario", item.valorUnitario).text(item.valorUnitario.toLocaleString());
            $("#quantidade").val(1);
            var totalItem = item.valorUnitario;
            $("#spanTotalItem").text(totalItem.toLocaleString());
            
            $("#foto-produto").attr("src", item.imagem);


            $("#produto").attr({
                "data-codigo-barra": item.codigoBarra,
                "data-descricao": item.descricao,
                "data-quantidade": 1,
                "data-valor-unitario": item.valorUnitario,
                "data-total": totalItem,
            });

            return item.descricao || item.text;
          },
    };


    var TableItens = {

        addItemToTable : function(item){
            var deferred = $.Deferred();
            var length = parseInt($("#itens tbody tr").length);
            var index = length + 1;
            var jsonWrapper = btoa(JSON.stringify(item));
            var row = '<tr data-item='+ jsonWrapper +'>'+
                '<td class="text-center">'+ index +'</td>'+
                '<td>'+ item.codigoBarra +'</td>'+
                '<td>'+ item.descricao +'</td>'+
                '<td>'+ item.quantidade +'</td>'+
                '<td>'+ item.valorUnitario+'</td>'+
                '<td>'+ item.valorItem +'</td>'+
                '<td class="col-sm-1 text-center">'+
                    '<a href="#" class="text-danger removeItem" data-toggle="tooltip" data-placement="right" title="Revover Item"><i class="fa fa-times fa-fw" aria-hidden="true"></i></a>'+
                '</td>'+
            '</tr>';
            $("#itens").append(row);
            deferred.resolve();
            return deferred;
        },

        calculaValorCompra: function(){

            var valorTotal = 0.0;
            $("#itens tbody tr").each(function(i, row){
                var item = JSON.parse(atob($(row).attr("data-item")));
                valorTotal += item.valorItem;
            });
            $("#spanValorTotal").text(valorTotal.toLocaleString());

        },

        reindexItens: function(){
            var count = 1;
            $("#itens tbody tr").each(function(i, row){
                $(row).children("td:eq(0)").text(count);
                count++;
            });
        },

        setTotalItens: function(){
            $("#totalItens").text(parseInt($("#itens tbody tr").length));
        }
    };
    

    $(function(){

        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        
        $("#quantidade").on("keyup",function(){
            
            var expre = /[^0-9]/g;
            if ($(this).val().match(expre))
                $(this).val($(this).val().replace(expre,''));
        });
        $("#quantidade").focusout(function(){
            var quantidade = parseInt($(this).val());
            
            if(isNaN(quantidade)){
                quantidade = 1;
                $(this).val(1);
            }
            var totalItem = parseFloat($("#spanValorUnitario").attr("data-valor-unitario")) * quantidade;
            $("#spanTotalItem").text(totalItem.toLocaleString());
            $("#produto").attr("data-quantidade", quantidade);
            $("#produto").attr("data-total", totalItem);
        });

        $("#addItem").off("click").on("click",function(){
            
            var item = {};
            item.codigoBarra = $("#produto").attr("data-codigo-barra");
            item.descricao = $("#produto").attr("data-descricao");
            item.quantidade = parseInt($("#produto").attr("data-quantidade"));
            item.valorUnitario = parseFloat($("#produto").attr("data-valor-unitario"));
            item.valorItem = parseFloat($("#produto").attr("data-total"));

            $.when(TableItens.addItemToTable(item)).then(TableItens.calculaValorCompra());
            TableItens.setTotalItens();
        });


        $(document).off("click", ".removeItem").on("click", ".removeItem",function(){
            TableItens.calculaValorCompra();
            $(this).parents("tr").remove();
            TableItens.reindexItens();
            TableItens.setTotalItens();
        });

        $("#clearAll").on("click",function(){
            $("#itens tbody").empty();
            TableItens.calculaValorCompra();
            TableItens.setTotalItens();
        });

        $("#busca-produto").select2({
            theme: 'bootstrap',
            ajax: {
              url: api["pdv.pesquisa.produto"],
              dataType: 'json',
              data: function (params) {
                return {
                    value: params.term
                };
              },
              processResults: function (data, params) {
                var select2data = $.map(data, function(obj) {
                    obj.id = obj.codigoBarra;
                    obj.text = obj.descricao;
                    return obj;
                  });

                return {
                    results: select2data
                  };
              },
              cache: false
            },
            placeholder: 'Buscar Produtos',
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: BuscaProdutos.formatItem,
            templateSelection: BuscaProdutos.formatItemSelection
          });

    });
});