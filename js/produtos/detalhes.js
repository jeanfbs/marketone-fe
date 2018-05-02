define(['api'], function(api){

    $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
    
    $(function(){
        $(".delete-one").oneDelete({
            redirect: api["produtos.deletar"],
            url: api["produtos.deletar"]
        });
    });

});