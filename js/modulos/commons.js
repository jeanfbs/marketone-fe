define(['ajax'],function(Ajax){

    $.fn.extend({
        oneDelete: function(param){
            $(this).off("click").on("click",function(){
                
                deleteIds = $(this).parents(".modal").find(".deleteIds input[type=hidden]");
                aData = [];
                $.each(deleteIds,function(i,v){
                    input = $(v);
                    aData.push(input.val());
                });
                var ajaxRequest = new Ajax.WebClient(param.url, "DELETE", JSON.stringify({ listId : aData }));
                ajaxRequest.call().done(function(json){
                    if(json.error){
                        if(typeof param.error == "function"){
                            param.error(json);
                        }else{
                            $("#modal-message").remove();
                            var alert = $('<div class="alert alert-danger alert-dismissible fade in" id="modal-message" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
                            var msg = '<p><i class="fa fa-exclamation-triangle fa-fw" aria-hidden="true"></i> '+ json.result +'<p>';
                            alert.append(msg);
                            $(".modal-body").append(alert);
                        }
                    }else{
                        $(".all").prop("checked",false);
                        $(".modal").modal("hide");
                        if(typeof param.callback == "function"){
                            param.callback(json);
                        }
                        window.location.href = param.redirect;
                    }
                });
            });
        }
    });
        
    $.fn.extend({
        delete: function()
        {
            $(this).off("click").on("click",function(){
        
                items = $(".check-id:checked");
        
                if(items.lenght == 0){
                    $(".modal").modal("hide");
                    return false;
                }
                div = $(".deleteIds");
                div.empty();
                $.each(items,function(i,it){
                    item = $("<input type='hidden' class='ids'>");
                    item.val(it.value);
                    div.append(item);
                });
            });
        }
    });
        
        
        
    $.fn.extend({
        confirmDelete: function(param){
            $(this).on("click",function(){
                
                deleteIds = $(this).parents(".modal").find(".deleteIds  input[type=hidden]");
                
                aData = [];
                $.each(deleteIds,function(i,v){
                    input = $(v);
                    aData.push(input.val());
                });
                
                $.ajax({
                    type: "DELETE",
                    headers: {
                        "content-type": "application/json",
                        "cache-control": "no-cache",
                    },
                    url : param.url,
                    data : JSON.stringify({ listId : aData }),
                    dataType: 'json',
                    success: function(json){				
                        if(json.error){
                            if(typeof param.error == "function"){
                                param.error(json);
                            }else{
                                $("#modal-message").remove();
                                var alert = $('<div class="alert alert-danger alert-dismissible fade in" id="modal-message" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
                                var msg = '<p><i class="fa fa-exclamation-triangle fa-fw" aria-hidden="true"></i> '+ json.result +'<p>';
                                alert.append(msg);
                                $(".modal-body").append(alert);
                            }
                        }else{
                            if(typeof param.callback == "function"){
                                param.callback(json);
                            }
                            location.reload();
                        }
                    },
                });
            });
        }
    });


    $.fn.extend({
        showAlert: function(message, type){
            var s = $(this);
            var alertDiv = $("<div></div>").addClass("alert alert-dismissible fade in").attr("role","alert");
            var icon = $("<i></i>").addClass("fa fa-exclamation-triangle fa-fw").attr("aria-hidden","true");
            var b = $("<b></b>");
            if(type == "warn"){
                alertDiv.addClass("alert-warning");
                b.text("Atenção");
            }
            else if(type == "erro"){
                alertDiv.addClass("alert-danger");
                b.text("Erro");
            }
            else {
                icon = $("<i></i>").addClass("fa fa-check fa-fw").attr("aria-hidden","true");
                alertDiv.addClass("alert-success");
                b.text("");
            }
            var button = $("<button></button>").attr({"type":"button", "data-dismiss":"alert", "aria-label":"Close"}).addClass("close");
            button.append($("<span></span>").attr("aria-hidden","true").text("x"));
            alertDiv.append(button);
            var paragraph = $("<p></p>");
            paragraph.append(icon).append(b).append(" ").append(message);
            alertDiv.append(paragraph);
            s.prepend(alertDiv);
        }
    });

    $.fn.extend({
        autoLoadAddress: function(){
            $(this).focusout(function(){
                cep = $(this).val();
                $.ajax({
                    method: "GET",
                    url: "http://api.postmon.com.br/v1/cep/" + cep,
                    dataType: "json",
                    beforeSend: function(){
                        $(".iconLoadCep").removeClass("hide");
                    },
                    complete: function(){
                        $(".iconLoadCep").addClass("hide");
                    },
                    success: function(json){
                        $("#callback").empty();
                        $("#logradouro").val(json.logradouro);
                        $("#bairro").val(json.bairro);
                        $("#cidade").val(json.cidade);
                        $("#pais").val("Brasil");
                        var key = json.estado_info.nome.toUpperCase().replace(' ','_');
                        $("#estado").select2('val', [key, json.estado_info.nome]);
                    },
                    error : function(XMLHttpRequest, textStatus, errorThrown) {
                        $("#callback").text("Erro ao chamar o serviço de verificação de CEP");
                    },
                });
            });
        }
    });

    $.fn.extend({
        validate: function(){
            $(this).formValidation({
                framework: 'bootstrap',
                icon: {
                    valid: '',
                    invalid: '',
                    validating: ''
                },
                locale: 'pt_BR',
            });
        }
    });

    $.fn.extend({
        fileUpload: function(){
            $(this).fileinput({
                language: "pt-BR",
                browseClass: "btn btn-primary btn-block",
                showCaption: false,
                showRemove: false,
                showUpload: false,
                browseLabel:"Buscar arquivo",
                maxImageWidth: 300,
                maxImageHeight: 300,
                resizeImage: true,
                allowedFileExtensions: ["jpg", "jpeg", "png"]
            });
        }
    });
    
});