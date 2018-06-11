define(function(){

    var Shorcut = {
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        ENTER: 13
    };

    var Registry = (function(){

        var keyMapsArray = null;

        function Registry(){
            this.keyMapsArray = [];
        }

        Registry.prototype.add = function _add(keyCode, callback){
            
            var keyMap = {
                keyCode: keyCode,
                callback: callback
            };
            var _keyMapsArray = this.keyMapsArray;
            _keyMapsArray.push(keyMap);
            
            $(document).off("keyup").on("keyup", function(e){
                e.stopPropagation();
                $.each(_keyMapsArray, function(i, keyMap){
                    if(e.keyCode == keyMap.keyCode){
                        keyMap.callback();
                    }
                });
            });
        };

        return Registry;
    })();

    return {
        Registry:Registry,
        Shorcut: Shorcut
    };
});