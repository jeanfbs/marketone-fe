define(['ajax', 'api'], function(Ajax, api){


    var Conta = {

        setCurrentAccount: function(){

        }
    };



    $(function(){

        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        

        $(".account-box").on("click", function(){

            $(".account-box").each(function(){
                $(this).removeClass("account-selected");
            });

            $(this).addClass("account-selected");
        });

    });
});