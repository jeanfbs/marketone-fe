define(['api'], function(api){

    $(function(){

        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        
        $(".delete-one").oneDelete({
            redirect: api["produtos.deletar"],
            url: api["produtos.deletar"]
        });
    });

});