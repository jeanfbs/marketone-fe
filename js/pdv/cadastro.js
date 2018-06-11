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
        $("#navbar-theme").addClass("hide");

        $("#hideMenu").on("click", function(){
            var selected = $(this).hasClass("selected");
            if(!selected){
                $(this).addClass("selected");
                $("#navbar-theme").removeClass("hide").fadeOut(200);
            }
            else{
                $(this).removeClass("selected");
                $("#navbar-theme").removeClass("hide").fadeIn(200);
            }
        });
        
        $("#busca-produto").on("keyup", function(e){
            
            if (e.keyCode == 13) {
                var inputValue = $(this).val();
                var codigoBarra = 0;

                if(inputValue.indexOf("*") == 1){
                    codigoBarra = parseInt(inputValue.split("*")[1]);
                }else{
                    codigoBarra = parseInt(inputValue);
                }
                
                var ajaxBuscaProduto = new Ajax.WebClient(api["pdv.pesquisa.produto"] + "?codigoBarra=" + codigoBarra, "GET");

                ajaxBuscaProduto.call().done(function(json){
                    // vc parou aqui
                    var item = {};
                    item.codigoBarra = $("#produto").attr("data-codigo-barra");
                    item.descricao = $("#produto").attr("data-descricao");
                    item.quantidade = parseInt($("#produto").attr("data-quantidade"));
                    item.valorUnitario = parseFloat($("#produto").attr("data-valor-unitario"));
                    item.valorItem = parseFloat($("#produto").attr("data-total"));

                    $.when(TableItens.addItemToTable(item)).then(TableItens.calculaValorCompra());
                    TableItens.setTotalItens();
            
                  }).fail(function(err){
                    alert("erro");
                  });
            }
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


    });
});