define(['ajax', 'api'], function(Ajax, api){

    var Impostos = {
        
        calcular: function(precoCompra, outrosCustos, impostos, taxaLucro){
            
            var valorFinal = precoCompra;
            $.each(impostos, function(i, taxa){
                var valorImposto = precoCompra * (taxa / 100);
                valorFinal -= valorImposto;
            });

            valorFinal += this.NaNtoDefaultValue(outrosCustos, 0);

            var valorLucro = valorFinal * (taxaLucro / 100);
            valorFinal += valorLucro;
            var totalTaxasImpostos = 0;

            $.each(impostos, function(i, taxa){
                totalTaxasImpostos += taxa;
            });

            var indiceImpostos = 1 - (totalTaxasImpostos / 100);

            
            valorFinal /= indiceImpostos;
            
            return {
                valorFinal: this.NaNtoDefaultValue(valorFinal.toFixed(2), ''),
                valorLucro: this.NaNtoDefaultValue(valorLucro.toFixed(2), '')
            };
        },

        NaNtoDefaultValue: function(number, defaultValue){
            return isNaN(number) ? defaultValue: number;
        }
    };


    var Preco = {

        calcular: function(selectors){
                
                var precoCompra = parseFloat(selectors[0].val());
                var outrosCustos = parseFloat(selectors[1].val());
                var impostos = [];
                $.each(selectors.slice(2,5), function(i, el){
                    impostos.push(Impostos.NaNtoDefaultValue(parseFloat(el.val()), 0));
                });
                var margemLucro = parseFloat(selectors[5].val());
                
                var resultado = Impostos.calcular(precoCompra, outrosCustos, impostos, margemLucro);

                $("#preco-venda").val(resultado.valorFinal);
                $("#valor-lucro").val(resultado.valorLucro);
        }
    };




    $(function(){

        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        
        $("#produtoForm").validate();

        var selectors = [$("#preco-compra"), $("#outros-custos"), $("#icms"), $("#pis"), $("#cofins"), $("#margem-lucro")];
        
        $.each(selectors, function(i, el){
            el.off("keyup").on("keyup", function(){
                Preco.calcular(selectors);
            });
        });



        $("#btn-search").on("click", function(){

            var produto = $("#input-search").val();

            var ajaxTaxaPorProduto = new Ajax.WebClient(api["produtos.taxas.pesquisa"], "GET", { produto: produto });
            
            ajaxTaxaPorProduto.call().done(function(data){
                
                $("#icms").val(data.icms);
                $("#pis").val(data.pis);
                $("#cofins").val(data.cofins);
                Preco.calcular(selectors);

            }).fail(function(erro){
                
                $("#msg-erro-busca-taxas").removeClass("hide").text("Não foi possível recuperar as taxas para esse produto");
            });
        });


        $("#prioridade").select2({
            placeholder: "Selecione uma opção",
            allowClear: true,
		    theme: "bootstrap",
            templateResult: function(data) {
                split = data.text.split(",");
                var html = $("<h4>"+ split[0] +"</h4> <small>" + split[1] + "</small>");
                return html;
            },
            templateSelection: function(data){
                split = data.text.split(",");
                return split[0];
            }
        });


        $(".photo").fileUpload();
        

    });
});