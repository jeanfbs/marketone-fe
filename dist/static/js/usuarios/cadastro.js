define(["ajax","api"],function(a,o){$(function(){$("#insertHeader").load("../../fragmentos/menu-navegacao.html"),$("#produtoForm").validate(),$("#usuarioForm").validate(),$("#cep").autoLoadAddress(),$(".photo").fileUpload()})});