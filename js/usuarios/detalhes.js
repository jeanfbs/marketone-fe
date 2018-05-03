define(['api'], function(api){

    $(function(){

        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        
        $(".delete-one").oneDelete({
            redirect: api["usuarios.deletar"],
            url: api["usuarios.deletar"]
        });
    });

});