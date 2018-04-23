define(function(){

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

});