define(['ajax', 'api'], function(Ajax, api){

    $(function(){
        
        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");

        $("#fornecedorForm").validate();
        $("#cep").autoLoadAddress();
        $(".photo").fileUpload();
    });
});