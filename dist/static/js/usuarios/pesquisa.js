define(["datatable","api"],function(a,t){$(function(){$("#insertHeader").load("../../fragmentos/menu-navegacao.html");var e={bServerSide:!0,ajax:{url:t["usuarios.pesquisa"],type:"GET",data:function(e){e.search=[],e.search[0]={filter:$("#filter option:selected").val(),value:$(".input-search").val()},e.search[1]={filter:"status",value:$("#status option:selected").val()}}},columns:[{name:"cpf"},{name:"nome"},{name:"email"},{name:"perfilAcesso"},{name:"status"}],columnDefs:[{orderable:!1,targets:[0,5]},{targets:0,render:function(e,a,t,s){return"<input type='checkbox' class='check-id' id="+(e=t[1])+" value="+e+">"}}]};new a.Table($("#tabela-usuarios"),e,[null,"http://localhost:8789/download/pdf","http://localhost:8789/download/csv"]).show()})});