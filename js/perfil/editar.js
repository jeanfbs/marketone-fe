define(['commons'],function(commons){

    $("#insertHeader").load("../../fragments/header.html");


    $("#usuarioForm").formValidation({
        framework: 'bootstrap',
        icon: {
            valid: '',
            invalid: '',
            validating: ''
        },
        locale: 'pt_BR',
    });


    $("#cep").autoLoadAddress();

});