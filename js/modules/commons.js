define(function(){

    $.fn.extend({
        autoLoadAddress: function()
        {
            $(this).focusout(function(){
                cep = $(this).val();
                $.ajax({
                    method: "GET",
                    url: "http://api.postmon.com.br/v1/cep/" + cep,
                    dataType: "json",
                    beforeSend: function(){
                        $(".iconLoadCep").removeClass("hide");
                    },
                    complete: function(){
                        $(".iconLoadCep").addClass("hide");
                    },
                    success: function(json){
                        $("#callback").empty();
                        $("#logradouro").val(json.logradouro);
                        $("#bairro").val(json.bairro);
                        $("#cidade").val(json.cidade);
                        $("#pais").val("Brasil");
                        var key = json.estado_info.nome.toUpperCase().replace(' ','_');
                        $("#estado").select2('val', [key, json.estado_info.nome]);
                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown) {
                        $("#callback").text("Erro ao chamar o serviço de verificação de CEP");
                    },
                });
            });
        }
    });
    
});