define(["ajax","api"],function(e,o){var i={calcular:function(t,a,e,o){var l=t;$.each(e,function(a,e){l-=t*(e/100)});var r=(l+=this.NaNtoDefaultValue(a,0))*(o/100);l+=r;var i=0;return $.each(e,function(a,e){i+=e}),l/=1-i/100,{valorFinal:this.NaNtoDefaultValue(l.toFixed(2),""),valorLucro:this.NaNtoDefaultValue(r.toFixed(2),"")}},NaNtoDefaultValue:function(a,e){return isNaN(a)?e:a}},l=function(a){var e=parseFloat(a[0].val()),t=parseFloat(a[1].val()),o=[];$.each(a.slice(2,5),function(a,e){o.push(i.NaNtoDefaultValue(parseFloat(e.val()),0))});var l=parseFloat(a[5].val()),r=i.calcular(e,t,o,l);$("#preco-venda").val(r.valorFinal),$("#valor-lucro").val(r.valorLucro)};$(function(){$("#insertHeader").load("../../fragmentos/menu-navegacao.html"),$("#produtoForm").validate();var t=[$("#preco-compra"),$("#outros-custos"),$("#icms"),$("#pis"),$("#cofins"),$("#margem-lucro")];$.each(t,function(a,e){e.off("keyup").on("keyup",function(){l(t)})}),$("#btn-search").on("click",function(){var a=$("#input-search").val();new e.WebClient(o["produtos.taxas.pesquisa"],"GET",{produto:a}).call().done(function(a){$("#icms").val(a.icms),$("#pis").val(a.pis),$("#cofins").val(a.cofins),l(t)}).fail(function(a){$("#msg-erro-busca-taxas").removeClass("hide").text("Não foi possível recuperar as taxas para esse produto")})}),$("#prioridade").select2({placeholder:"Selecione uma opção",allowClear:!0,theme:"bootstrap",templateResult:function(a){return split=a.text.split(","),$("<h4>"+split[0]+"</h4> <small>"+split[1]+"</small>")},templateSelection:function(a){return split=a.text.split(","),split[0]}}),$(".photo").fileUpload()})});