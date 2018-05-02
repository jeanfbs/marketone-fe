define(function(){

    var WebClient = (function(){

        var url = null;
        var data = null;
        var method = null;

        function WebClient(url, method, data){
            
            this.url = url;
            this.data = data;
            this.method = method;

        }

        WebClient.prototype.call = function _call(){
            var settings = {
                crossDomain: true,
                headers: {
                  "content-type": "application/json",
                  "cache-control": "no-cache"
                },
                dataType: 'json',
            };
            
            settings.url = this.url;
            settings.method = this.method;
            if(data != undefined && data != null){
              settings.data = this.data;
            }
    
            return $.ajax(settings);
          };

          return WebClient;
    })();

    return {
        WebClient:WebClient
    };
});