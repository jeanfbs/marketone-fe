define(['commons'],function(commons){

    $("#insertHeader").load("../../fragments/header.html");
    $("#usuarioForm").validate();
    $("#cep").autoLoadAddress();

});