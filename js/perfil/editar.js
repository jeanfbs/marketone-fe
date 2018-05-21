define(['commons'],function(commons){
    
    $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
    $("#usuarioForm").validate();
    $("#cep").autoLoadAddress();
    $(".photo").fileUpload();
});