define(['ajax', 'keyevent', 'api'], function(Ajax, KeyEvent, api){

    var formato = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' };

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
            $("#spanValorUnitario").text(json.valorUnitario.toLocaleString('pt-BR', formato));
            $("#spanQuantidade").text(json.quantidade);
            $("#spanTotalItem").text(item.totalItem.toLocaleString('pt-BR', formato));

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
            TabelaItens.removeItem(index);
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
    

    var TabelaItens = {
        addItemToTable : function(item){
            
            var deferred = $.Deferred();
            var length = parseInt($("#itens tbody tr").length);
            var index = length + 1;
            var jsonWrapper = btoa(JSON.stringify(item));
            var row = '<tr data-item='+ jsonWrapper +'>'+
                '<td class="text-center">'+ index +'</td>'+
                '<td>'+ item.response.codigoBarra +'</td>'+
                '<td class="col-sm-6">'+ this.formatDescription(item.response.descricao, item.quantidade, item.response.medida) +'</td>'+
                '<td>'+ item.response.valorUnitario.toLocaleString('pt-BR', formato) +'</td>'+
                '<td>'+ item.totalItem.toLocaleString('pt-BR', formato) +'</td>'+
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
            TabelaItens.calculaValorCompra();
            TabelaItens.reindexItens();
            TabelaItens.setTotalItens();
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
            $("#spanValorTotal").text(valorTotal.toLocaleString('pt-BR', formato)).attr("data-valor-total", valorTotal);

        },

        getItens: function(){
            var itens = [];
            $("#itens tbody tr").each(function(i, row){
                var item = JSON.parse(atob($(row).attr("data-item")));
                itens.push(item);
            });

            return itens;
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
            var total = parseFloat($("#spanValorTotal").attr("data-valor-total"));
            var valorDesconto = 0;

            if($("#valorDeconto").val() != ""){
                valorDesconto = parseFloat($("#valorDeconto").val());
            }else if($("#taxaDesconto").val() != ""){
                valorDesconto = (parseFloat($("#taxaDesconto").val()) / 100) * total;
            }
            
            total -= valorDesconto;
            if(total < 0){
                Pagamento.Erro.print("O valor de desconto ultrapassou o valor total da compra.");
                Pagamento.invalidar();
                return false;
            }else{
                Pagamento.Erro.clear();
                Pagamento.validar();
            }
            $("#spanValorTotal").text(total.toLocaleString('pt-BR', formato)).attr("data-valor-desconto", valorDesconto);
            
            var troco = recebido - total;
            var spanValorRecebido = $("#spanValorRecebido");
            var spanValorTroco = $("#spanValorTroco");

            if(troco < 0){
                this.Erro.print("O valor recebido não é suficiente para completar o pagamento.");
                recebido = 0;
                troco = 0;
                this.invalidar();
            }else{
                this.Erro.clear();
                this.validar();
            }
            spanValorRecebido.text(recebido.toLocaleString('pt-BR', formato)).attr("data-valor-recebido",recebido);
            spanValorTroco.text(troco.toLocaleString('pt-BR', formato)).attr("data-valor-troco", troco);
        },

        estaAtivo: function(){
            return $("#pagamento").attr("data-ativo") === 'true';
        },
        estaValido: function(){
            return $("#pagamentoForm").attr("data-valid") === 'true';
        },
        invalidar: function(){
            $("#pagamentoForm").attr("data-valid", false);
        },
        validar: function(){
            $("#pagamentoForm").attr("data-valid", true);
        },
        trocaPagamentoDiv: function(status){
            
            var dadosProduto = $("#dadosProduto");
            var pagamento = $("#pagamento");
            var buscaProduto = $("#buscaProduto");

            if(!dadosProduto.hasClass("hide")){
                dadosProduto.addClass("hide");
                pagamento.removeClass("hide").attr("data-ativo", true);
                $("#cliente").focus();
                buscaProduto.prop("disabled", true);
            }else{
                dadosProduto.removeClass("hide");
                pagamento.addClass("hide").attr("data-ativo", false);
                buscaProduto.prop("disabled", false);
            }
        },
        setValoresCompra: function(compra){
            var spanValorTotal = $("#spanValorTotal");
            if(spanValorTotal.attr("data-valor-total") != "" && !isNaN(parseFloat(spanValorTotal.attr("data-valor-total")))){
                compra.valorTotal = parseFloat(spanValorTotal.attr("data-valor-total"));
                if(spanValorTotal.attr("data-valor-desconto") != "" && !isNaN(parseFloat(spanValorTotal.attr("data-valor-desconto")))){
                    compra.desconto = parseFloat(spanValorTotal.attr("data-valor-desconto"));
                }
            }

            var spanValorRecebido = $("#spanValorRecebido");
            if(spanValorRecebido.attr("data-valor-recebido") != "" && !isNaN(parseFloat(spanValorRecebido.attr("data-valor-recebido")))){
                compra.valorRecebido = parseFloat(spanValorRecebido.attr("data-valor-recebido"));
            }

            var spanValorTroco = $("#spanValorTroco");
            if(spanValorTroco.attr("data-valor-troco") != "" && !isNaN(parseFloat(spanValorTroco.attr("data-valor-troco")))){
                compra.valorTroco = parseFloat(spanValorTroco.attr("data-valor-troco"));
            }
        },

        setValoresPagamento: function(compra){
            var dinheiro = $("#dinheiro");
            if(dinheiro.val() != "" && !isNaN(parseFloat(dinheiro.val()))){
                compra.pagamento.dinheiro = parseFloat(dinheiro.val());
            }

            var debito = $("#cartaoDebito");
            if(debito.val() != "" && !isNaN(parseFloat(debito.val()))){
                compra.pagamento.debito = parseFloat(debito.val());
            }

            var credito = $("#cartaoCredito");
            if(credito.val() != "" && !isNaN(parseFloat(credito.val()))){
                compra.pagamento.credito = parseFloat(credito.val());
            }
        },

        setItensCompra: function(compra){
            compra.itens = TabelaItens.getItens();
        },
        Erro: {

            print: function(message){
                $("#erroPagamentoMessage").text(message);
                $("#erroPagamento").removeClass("hide");
            },
            clear: function(){
                $("#erroPagamentoMessage").text("");
                $("#erroPagamento").addClass("hide");
            } 
        }

    };

    var Compra = {
        limparDados: function(){
            $("#itens tbody").empty();
            $("#pagamentoForm input").each(function(){
                $(this).val("");
            });
            $("#cliente").val(null).trigger('change');
            $("#descricao").text("CAIXA LIVRE");
            

            var elements = [
                $("#medida"),
                $("#spanCodigoBarra"), 
                $("#spanValorUnitario"), 
                $("#spanQuantidade"),
                $("#spanTotalItem"),
                $("#spanValorTotal"),
                $("#spanValorRecebido"),
                $("#spanValorTroco")
            ];

            $.each(elements, function(i, el){
                $(this).text("");
            });
        }
    };


    var ProgressBar = {
        init: function(){
           return setInterval(this.addProgress, 150);
        },
        addProgress: function(){
            var selector = $(".progress-bar");
            var width = selector.width() + 50;
            selector.width(width);
        },
        stopProgress: function(loop){
            clearInterval(loop);
            $(".progress-bar").width(1);
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
            var navbarTheme = $("#navbar-theme");
            if(!selected){
                $(this).addClass("selected");
                navbarTheme.addClass("hide");
            }
            else{
                $(this).removeClass("selected");
                navbarTheme.removeClass("hide");
            }
        });

        var registry = new KeyEvent.Registry();

        registry.add(KeyEvent.Shorcut.F2, function(){
            $("#buscaProduto").focus().select();
        });


        registry.add(KeyEvent.Shorcut.F6, function(){
            
            if(!Pagamento.estaValido()){
                Alert.print("Os dados do pagamento estão inválidos.");
                return false;
            }
            var fecharCompraModal = $("#progressoFecharCompra").modal("show");
            var compra = {};
            Pagamento.setValoresCompra(compra);
            
            compra.pagamento = {};
            Pagamento.setValoresPagamento(compra);

            compra.itens = {};
            Pagamento.setItensCompra(compra);
            
            var loop = ProgressBar.init();

            setTimeout(function(){
               
                $.when( ProgressBar.stopProgress(loop)).then(function(){
                    fecharCompraModal.modal("hide");
                    Pagamento.trocaPagamentoDiv(false);
                    Compra.limparDados();
                });
            },2000);

            compra.caixa = parseInt($("#caixa").attr("data-id-caixa"));
            compra.timestamp = new Date().getTime();
            // a chamada ajax vai aqui

            
        });


        registry.add(KeyEvent.Shorcut.F7, function(){
            
            if(TabelaItens.getItens().length == 0){
                Alert.print("Nenhum item foi adicionado na compra.");
                return false;
            }
            Pagamento.trocaPagamentoDiv(!$("#dadosProduto").hasClass("hide"));
            
        });

        var removeIndexModal = new ModalConfirmacao("removeIndexModal");
        removeIndexModal.listenAccept(function(){
            var length = $("#itens tbody tr").length - 1;
            TabelaItens.removeItem(length);
            removeIndexModal.hide();
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

        $('#modalRemoveItemByIndex').on('shown.bs.modal', function(){
            $("#numeroItem").focus();
        });

        var cancelItemsModal = new ModalConfirmacao("cancelItemsModal");
        cancelItemsModal.listenAccept(function(){
            $("#itens tbody").empty();
            TabelaItens.calculaValorCompra();
            TabelaItens.setTotalItens();
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
            if(TabelaItens.getItens().length == 0){
                Alert.print("Nenhum item foi adicionado na compra.");
                return false;
            }
            cancelItemsModal.show("Você irá cancelar todos os itens da compra, deseja prosseguir?");
        });

        
        $("#buscaProduto").on("keyup", function(e){
            if (e.keyCode == KeyEvent.Shorcut.ENTER) {
                var inputValue = $(this).val();
                // TODO remover esse comentario apos terminar os testes
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
                    $.when(TabelaItens.addItemToTable(item)).then(TabelaItens.calculaValorCompra());
                    TabelaItens.setTotalItens();
            
                  }).fail(function(err){
                    alert("erro");
                  });
            }
        });

        $("#cliente").select2({
            theme: 'bootstrap',
            allowClear: true,
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

          $(".cash").on("keyup change", function(){
                Pagamento.calculaValorTroco();
          });

          $(".desconto").on("keyup change", function(){
                var id = $(this).attr("id");
                    
                $(".desconto").prop("disabled", false);
                if($(this).val() != ""){
                    if(id == "valorDeconto"){
                        $("#taxaDesconto").prop("disabled", true);
                    }
                    else{
                        $("#valorDeconto").prop("disabled", true);
                    }
                }
                Pagamento.calculaValorTroco();
          });

    });
});