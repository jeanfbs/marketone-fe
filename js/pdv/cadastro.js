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
                    "<span class='select2-info text-muted'><strong>Categoria:</strong> "+ response.categoria +"</span>"+
                    "<span class='select2-info text-muted'><strong>Marca:</strong> "+ response.marca +"</span>"+
                    "<span class='select2-info text-muted'><strong>Unidade:</strong> "+ response.medida +"</span>"+
                "</div>"+
            "</div>"
          
            return markup;
          },

          formatItemSelection : function (item) {

            $("#spanCodigoBarra").text(item.codigoBarra);
            item.valorUnitario = isNaN(item.valorUnitario) ? 0.0 : item.valorUnitario;
            
            $("#spanValorUnitario").attr("data-valor-unitario", item.valorUnitario).text(item.valorUnitario);

            var totalItem = item.valorUnitario * parseInt($("#quantidade").val());
            $("#spanTotalItem").text(totalItem);
            
            $("#foto-produto").attr("src", item.imagem);
            // $("#spanCodigoBarra").text(item.codigoBarra);
            // $("#spanCodigoBarra").text(item.codigoBarra);

            return item.descricao || item.text;
          },
    }
    

    $(function(){

        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        
        $("#quantidade").focusout(function(){

            var totalItem = parseFloat($("#spanValorUnitario").attr("data-valor-unitario")) * parseInt($("#quantidade").val());
            $("#spanTotalItem").text(totalItem.toFixed(2));
        });

        $("#busca-produto").select2({
            theme: 'bootstrap',
            ajax: {
              url: api["pdv.pesquisa.produto"],
              dataType: 'json',
              delay: 250,
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