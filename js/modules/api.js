define(function(){
    
    var baseUrl = "http://localhost:3003/api/";
    var api = {
        "vendas.atual.dinheiro": baseUrl + "knob1",
        "vendas.atual.credito": baseUrl + "knob2",
        "vendas.atual.debito": baseUrl + "knob3",
        "vendas.acumulo.mes": baseUrl + "donut1",
        "vendas.semanal": baseUrl + "bar1",
        "vendas.mensal": baseUrl + "bar2",
        "estoque.anual": baseUrl + "bar3",
        "estoque.indicadores.periodo": baseUrl + "indicadorEstoque",
        "estoque.indicadores.periodo.item": baseUrl + "indicadorItemEstoque",
        "faturamento.mensal": baseUrl + "line4",
        "usuario.pesquisa": baseUrl + "buscarUsuarios"
    };

    return api;
});