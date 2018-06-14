define(['ajax', 'keyevent', 'api'], function(Ajax, KeyEvent, api){

    var BuscaProdutos = {
          process : function (json) {
            
            var item = {};
            item.response = json;
            item.quantidade = json.quantidade;
            item.totalItem = parseFloat(json.valorUnitario) * json.quantidade;
            item.response.valorUnitario = (isNaN(item.response.valorUnitario) ? 0.0 : item.response.valorUnitario);
            $("#descricao").text(json.descricao);
            $("#medida").text(json.medida);
            $("#spanCodigoBarra").text(json.codigoBarra);
            $("#spanValorUnitario").text(json.valorUnitario.toLocaleString());
            $("#spanQuantidade").text(json.quantidade);
            $("#spanTotalItem").text(item.totalItem.toLocaleString());

            return item;
          }
    };

    var ModalRemoveItemByIndex = {
        selector: $("#modalRemoveItemByIndex"),
        show: function(){
            $("#numeroItem").empty();
            $("#itens tbody tr").each(function(i, o){
                $("#numeroItem").append($("<option></option>").val(i).text(i + 1));
            });
            this.selector.modal('show');
        },

        hide: function(){
            this.selector.modal('hide');
        },
        listenEvent: function(){
            var _this = this;
            $("#btnRemoveItem").on("click", function(){
                _this.confirmed();
            });

            $("#numeroItem").on("keydown", function(e){
                // digitar S para a opcao SIM
                if(e.which == KeyEvent.Shorcut.S){
                    _this.confirmed();
                }
            });
        },
        confirmed: function(){
            var selector = $("#numeroItem");
            var index = selector.find("option:selected").val();
            TableItens.removeItem(index);
            this.selector.modal('hide');
            selector.val("");
        }
    };

    var ModalConfirmacao = (function(){

        var name = null;
        var button = null;

        function ModalConfirmacao(name, callback){
            this.name = name;
            this.button = name + 'BtnAccept';
            buildModal(name, this.button);
        }

        var buildModal = function _buildModal(name, button){
            var innerHTML = '<div class="modal fade" tabindex="-1" role="dialog" id="'+ name +'" aria-labelledby="alertModal">'+
            '        <div class="modal-dialog modal-md" role="document">'+
            '            <div class="modal-content">'+
            '                <div class="modal-header">'+
            '                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
            '                        <span aria-hidden="true">×</span>'+
            '                    </button>'+
            '                    <h4 class="modal-title text-primary" id="alertModal">Confirmação de exclusão de item na compra</h4>'+
            '                </div>'+
            '                <div class="modal-body">'+
            '                    <p class="text-justify message">'+
            '                    </p>'+
            '                </div>'+
            '                <div class="modal-footer">'+
            '                    <button type="button" class="btn btn-default" data-dismiss="modal">Não</button>'+
            '                    <button type="button" class="btn btn-primary"  id="'+ button +'">Sim</button>'+
            '                </div>'+
            '            </div>'+
            '        </div>'+
            '    </div>';
            
            $("#content").append(innerHTML);
        };

        ModalConfirmacao.prototype.listenAccept = function _listenAccept(callback){
            
            $("#" + this.button).on("click", function(){
                callback();
            });

            $("#" + this.name).on("keydown", function(e){
                if(e.which == KeyEvent.Shorcut.ENTER){
                    callback();
                }
            });
        };

        ModalConfirmacao.prototype.show = function _show(message){
            var length = $("#itens tbody tr").length;
            $("#" + this.name).find(".message").text(message);
            $("#" + this.name).modal('show');
        };

        ModalConfirmacao.prototype.hide = function _hide(){
            $("#" + this.name).modal('hide');
        };

        return ModalConfirmacao;
    })();
    

    var TableItens = {
        addItemToTable : function(item){
            
            var deferred = $.Deferred();
            var length = parseInt($("#itens tbody tr").length);
            var index = length + 1;
            var jsonWrapper = btoa(JSON.stringify(item));
            var row = '<tr data-item='+ jsonWrapper +'>'+
                '<td class="text-center">'+ index +'</td>'+
                '<td>'+ item.response.codigoBarra +'</td>'+
                '<td class="col-sm-6">'+ this.formatDescription(item.response.descricao, item.quantidade, item.response.medida) +'</td>'+
                '<td>R$ '+ item.response.valorUnitario.toLocaleString() +'</td>'+
                '<td>R$ '+ item.totalItem.toLocaleString() +'</td>'+
            '</tr>';
            $("#itens").append(row);
            var height = parseInt($("#itens tbody").height());
            $(".dataTables_scrollBody").scrollTop(height);
            deferred.resolve();
            return deferred;
        },

        removeItem: function(index){
            var length = $("#itens tbody tr").length;
            if(length == 0){
                Alert.print("Não há itens para serem excluidos");
                return false;
            }
            $("#itens tbody tr:eq("+ index +")").remove();
            TableItens.calculaValorCompra();
            TableItens.reindexItens();
            TableItens.setTotalItens();
        },
        
        formatDescription: function(descricao, quantidade, medida){
            return descricao + '&emsp;&emsp;&emsp;&emsp;' + quantidade + ' x ' + medida;
        },

        calculaValorCompra: function(){

            var valorTotal = 0.0;
            $("#itens tbody tr").each(function(i, row){
                var item = JSON.parse(atob($(row).attr("data-item")));
                valorTotal += item.totalItem;
            });
            $("#spanValorTotal").text(valorTotal.toLocaleString()).attr("data-total-compra", valorTotal);

        },

        reindexItens: function(){
            var count = 1;
            $("#itens tbody tr").each(function(i, row){
                $(row).children("td:eq(0)").text(count);
                count++;
            });
        },

        setTotalItens: function(){
            $(".dataTables_scrollFootInner").find("td[colspan=2]").text(parseInt($("#itens tbody tr").length));
        }
    };

    var Alert = {
        print: function(message){
            var selector = $("#alert");
            selector.find("#alertMessage").text(message);
            selector.removeClass("hide");
            setTimeout(function(){
                selector.addClass("hide");
            }, 5000);
        }
    };

    var BuscaCliente = {

        formatItem : function (response) {
            if (response.loading) {
                return response.text;
            }
            return response.nome;
          },

          formatItemSelection : function (item) {
            $("#codigoCliente").val(item.cpfCnpj);
            return item.nome || item.text;
          },

    };

    var Pagamento = {

        calculaValorTroco: function(){
            var recebido = 0.0;
            $(".cash").each(function(i, el){
                recebido += isNaN($(this).val()) || $(this).val() == "" ? 0.0 : parseFloat($(this).val());
            });
            var total = parseFloat($("#spanValorTotal").attr("data-total-compra"));
            var troco = recebido - total;
            $("#spanValorRecebido").text(recebido.toLocaleString()).attr("data-valor-recebido",recebido);
            $("#spanValorTroco").text(troco.toLocaleString()).attr("data-valor-troco", troco);
        },

        estaAtivo: function(){
            return $("#pagamento").attr("data-ativo") === 'true';
        }

    };


    $(function(){


        $("#insertHeader").load("../../fragmentos/menu-navegacao.html");
        $("#navbar-theme").addClass("hide");
        
        var datatable = $("#itens").DataTable({
            "paging":   false,
            "ordering": false,
            "info":     false,
            "searching": false,
            "scrollY":  '175px',
            "scrollCollapse": true
        });
        $("#itens tbody").empty();
        $("#hideMenu").on("click", function(){
            var selected = $(this).hasClass("selected");
            if(!selected){
                $(this).addClass("selected");
                $("#navbar-theme").addClass("hide");
            }
            else{
                $(this).removeClass("selected");
                $("#navbar-theme").removeClass("hide");
            }
        });

        var registry = new KeyEvent.Registry();

        registry.add(KeyEvent.Shorcut.F2, function(){
            $("#buscaProduto").focus().select();
        });

        registry.add(KeyEvent.Shorcut.F6, function(){
            alert("FInalizar Compra?");
        });


        registry.add(KeyEvent.Shorcut.F7, function(){
            
            
            var dadosProduto = $("#dadosProduto");
            var pagamento = $("#pagamento");

            if(!dadosProduto.hasClass("hide")){
                dadosProduto.addClass("hide");
                pagamento.removeClass("hide").attr("data-ativo", true);
                $("#cliente").focus();
                $("#buscaProduto").prop("disabled", true);
            }else{
                dadosProduto.removeClass("hide");
                pagamento.addClass("hide").attr("data-ativo", false);
                $("#buscaProduto").prop("disabled", false);
            }
        });

        var removeIndexModal = new ModalConfirmacao("removeIndexModal");
        removeIndexModal.listenAccept(function(){
            removeIndexModal.hide();
            var length = $("#itens tbody tr").length;
            TableItens.removeItem(length);
        });

        registry.add(KeyEvent.Shorcut.F8, function(){
            if(Pagamento.estaAtivo()){
                Alert.print("Não é possivel remover itens durante o processo de pagamento.");
                return false;
            }
            var lastItem = $("#itens tbody tr").length;
            removeIndexModal.show("Você irá remover o item "+ lastItem +" da compra, deseja prosseguir?");   
        });

        ModalRemoveItemByIndex.listenEvent();
        registry.add(KeyEvent.Shorcut.F9, function(){
            if(Pagamento.estaAtivo()){
                Alert.print("Não é possivel remover itens durante o processo de pagamento.");
                return false;
            }
            ModalRemoveItemByIndex.show();
        });

        $('#modalRemoveItemByIndex').on('shown.bs.modal', function () {
            $("#numeroItem").focus();
        });

        var cancelItemsModal = new ModalConfirmacao("cancelItemsModal");
        cancelItemsModal.listenAccept(function(){
            $("#itens tbody").empty();
            TableItens.calculaValorCompra();
            TableItens.setTotalItens();
            $("#pagamento input").each(function(){
                $(this).val("");
            });
            $("#spanValorRecebido").text(0).attr("data-valor-recebido",0);
            $("#spanValorTroco").text(0).attr("data-valor-troco", 0);
            $("#dadosProduto").removeClass("hide");
            $("#pagamento").addClass("hide");
            $("#buscaProduto").prop("disabled", false);
            cancelItemsModal.hide();
        });

        registry.add(KeyEvent.Shorcut.F10, function(){
            cancelItemsModal.show("Você irá cancelar todos os itens da compra, deseja prosseguir?");
        });

        
        $("#buscaProduto").on("keyup", function(e){
            if (e.keyCode == KeyEvent.Shorcut.ENTER) {
                var inputValue = $(this).val();
                // $(this).val("");
                var codigoBarra = 0;
                var quantidade = 1;

                if(inputValue.indexOf("*") == 1){
                    codigoBarra = parseInt(inputValue.split("*")[1]);
                    quantidade = parseInt(inputValue.split("*")[0]);
                }else{
                    codigoBarra = parseInt(inputValue);
                }
                
                var ajaxBuscaProduto = new Ajax.WebClient(api["pdv.pesquisa.produto"] + "?codigoBarra=" + codigoBarra, "GET");
                
                ajaxBuscaProduto.call().done(function(json){
                    json[0].quantidade = quantidade;
                    var item = BuscaProdutos.process(json[0]);
                    $.when(TableItens.addItemToTable(item)).then(TableItens.calculaValorCompra());
                    TableItens.setTotalItens();
            
                  }).fail(function(err){
                    alert("erro");
                  });
            }
        });

        $("#cliente").select2({
            theme: 'bootstrap',
            ajax: {
              url: api["pdv.pesquisa.cliente"],
              dataType: 'json',
              data: function (params) {
                return {
                    value: params.term
                };
              },
              processResults: function (data, params) {
                var select2data = $.map(data, function(obj) {
                    obj.id = obj.cpfCnpj;
                    obj.text = obj.nome;
                    return obj;
                  });

                return {
                    results: select2data
                  };
              },
              cache: false
            },
            placeholder: 'Buscar Clientes',
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: BuscaCliente.formatItem,
            templateSelection: BuscaCliente.formatItemSelection
          });


          $(".cash").focusout(function(){

            Pagamento.calculaValorTroco();

          });

    });
});