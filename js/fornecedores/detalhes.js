define(['api'], function(api){

    $(function(){

        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        
        $(".delete-one").oneDelete({
            redirect: api["fornecedores.deletar"],
            url: api["fornecedores.deletar"]
        });
    });

});