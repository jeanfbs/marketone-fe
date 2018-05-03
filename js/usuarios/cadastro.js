define(['ajax', 'api'], function(Ajax, api){

    $(function(){
        
        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");

        $("#usuarioForm").validate();
        $("#cep").autoLoadAddress();

        $(".photo").fileUpload();
        

    });
});