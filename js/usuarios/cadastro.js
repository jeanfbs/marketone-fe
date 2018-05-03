define(['ajax', 'api'], function(Ajax, api){

    $(function(){
        
        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");

        $("#produtoForm").validate();

        $("#usuarioForm").validate();
        $("#cep").autoLoadAddress();

        $(".photo").fileUpload();
        

    });
});