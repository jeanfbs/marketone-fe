define(['ajax', 'keyevent', 'api'], function(Ajax, KeyEvent, api){

    var BuscaProdutos = {
          process : function (json) {
            
            var item = {};
            item.response = json;
            item.quantidade = json.quantidade;
            item.totalItem = parseFloat(json.valorUnitario) * json.quantidade;
            item.response.valorUnitario = (isNaN(item.response.valorUnitario) ? 0.0 : item.response.valorUnitario);
            $("#descricao").text(json.descricao);
            $("#spanCodigoBarra").text(json.codigoBarra);
            $("#spanValorUnitario").text(json.valorUnitario.toLocaleString());
            $("#spanQuantidade").text(json.quantidade);
            $("#spanTotalItem").text(item.totalItem.toLocaleString());

            return item;
          }
    };


    var TableItens = {

        addItemToTable : function(item){
            
            var deferred = $.Deferred();
            var length = parseInt($("#itens tbody tr").length);
            var index = length + 1;
            var jsonWrapper = btoa(JSON.stringify(item));
            var row = '<tr data-item='+ jsonWrapper +'>'+
                '<td class="text-center">'+ index +'</td>'+
                '<td>'+ item.response.codigoBarra +'</td>'+
                '<td>'+ item.response.descricao +'</td>'+
                '<td>'+ item.quantidade +'</td>'+
                '<td>'+ item.response.valorUnitario+'</td>'+
                '<td>'+ item.totalItem +'</td>'+
                '<td class="col-sm-1 text-center">'+
                    '<a href="#" class="text-danger removeItem" data-toggle="tooltip" data-placement="right" title="Remover Item"><i class="fa fa-times fa-fw" aria-hidden="true"></i></a>'+
                '</td>'+
            '</tr>';
            $("#itens").append(row);
            var height = parseInt($("#itens tbody").height());
            $(".dataTables_scrollBody").scrollTop(height);
            deferred.resolve();
            return deferred;
        },

        calculaValorCompra: function(){

            var valorTotal = 0.0;
            $("#itens tbody tr").each(function(i, row){
                var item = JSON.parse(atob($(row).attr("data-item")));
                valorTotal += item.totalItem;
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
            $(".dataTables_scrollFootInner").find("td[colspan=2]").text(parseInt($("#itens tbody tr").length));
        }
    };
    

    $(function(){


        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        $("#navbar-theme").addClass("hide");

        var datatable = $("#itens").DataTable({
            "paging":   false,
            "ordering": false,
            "info":     false,
            "searching": false,
            "scrollY":  '200px',
            "scrollCollapse": true,
            'oLanguage': {
                'sZeroRecords': 'Nenhum produto foi adicionado',
            }
        });
        $("#itens tbody").empty();
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

        var registry = new KeyEvent.Registry();
        registry.add(KeyEvent.Shorcut.F9, function(){
            $("#busca-produto").focus().select();
        });

        
        $("#busca-produto").on("keyup", function(e){
            
            if (e.keyCode == KeyEvent.Shorcut.ENTER) {
                var inputValue = $(this).val();
                $(this).val("");
                var codigoBarra = 0;
                var quantidade = 1;

                if(inputValue.indexOf("*") == 1){
                    codigoBarra = parseInt(inputValue.split("*")[1]);
                    quantidade = parseInt(inputValue.split("*")[0]);
                }else{
                    codigoBarra = parseInt(inputValue);
                }
                
                var ajaxBuscaProduto = new Ajax.WebClient(api["pdv.pesquisa.produto"] + "?codigoBarra=" + codigoBarra, "GET");
                
                ajaxBuscaProduto.call().done(function(json){
                    json[0].quantidade = quantidade;
                    var item = BuscaProdutos.process(json[0]);
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