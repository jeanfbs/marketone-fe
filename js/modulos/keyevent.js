define(function(){

    var Shorcut = {
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
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
            
            $(document).off("keydown").on("keydown", function(e){
                $.each(_keyMapsArray, function(i, keyMap){
                    if(e.which == keyMap.keyCode){
                        e.preventDefault();
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