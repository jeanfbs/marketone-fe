define(function(){

    var Get = (function(){

        var url = null;
        var data = null;

        function Get(url, data){

            this.url = url;
            this.data = data;

        }

        Get.prototype.call = function _call(){
            var settings = {
                crossDomain: true,
                headers: {
                  "content-type": "application/json",
                  "cache-control": "no-cache"
                },
                dataType: 'json',
            };
            
            settings.url = this.url;
            settings.method = "GET";
            if(data != undefined && data != null){
              settings.data = this.data;
            }
    
            return $.ajax(settings);
          };

          return Get;
    })();


    return {
        Get:Get
    };
});