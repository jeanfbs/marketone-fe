define(['ajax', 'api'], function(Ajax, api){

    $(function(){

        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        
        $("#busca-produto").select2({
            
            ajax: {
              url: api["pdv.pesquisa.produto"],
              dataType: 'json',
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
            templateResult: formatItem,
            templateSelection: formatItemSelection
          });
          
          function formatItem (response) {
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
          }
          function formatItemSelection (response) {
            return response.descricao || response.text;
          }

    });
});