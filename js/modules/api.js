define(function(){
    
    var baseUrl = "http://localhost:3003/api/";
    var api = {
        "vendas.atual.dinheiro": baseUrl + "knob1",
        "vendas.atual.credito": baseUrl + "knob2",
        "vendas.atual.debito": baseUrl + "knob3"
    };

    return api;
});