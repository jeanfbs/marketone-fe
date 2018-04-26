define(function(){

    var Table = (function(){

        var settings = null;
        var dataTable = null;
        var selector = null;

        function Table(selector, opts){
            
            this.selector = selector;

            this.settings = makeDefaultSettings();
            this.settings.bServerSide = (opts.bServerSide != null && opts.bServerSide != undefined) ? opts.bServerSide: false;
            
            if(opts.ajax != null && opts.ajax != undefined){
                this.settings.ajax = opts.ajax;
            }
            if(opts.columns != null && opts.columns != undefined){
                this.settings.columns = opts.columns;
            }
            if(opts.columnDefs != null && opts.columnDefs != undefined){
                this.settings.columnDefs = opts.columnDefs;
            }
            
            this.settings.aaSorting =  (opts.aaSorting == undefined) ? [[ 1, "asc" ]] : opts.aaSorting;
        }

        
        var makeDefaultSettings = function(){
            return {
                "lengthMenu": [[2,25,50, -1], [2,25,50, "Todos"]],
                "scrollX": true,
                "scrollY": '80vh',
                "scrollCollapse": true,
                "pagingType": "simple",
                "sDom":'<"rowDT text-primary" <"col-md-3 col-sm-3 col-xs-8"l> <"col-md-2 col-sm-2 hidden-xs"><"col-md-5 col-sm-5 hidden-xs text-right"i><"col-md-2 col-xs-4 text-right"p>><"clear">rt<"rowDT text-primary"<"#buttons.col-md-3 col-sm-3 col-xs-8"l> <"col-md-2 col-sm-2 hidden-xs"><"col-md-5 col-sm-5 hidden-xs text-right"i><"col-md-2 col-xs-4 text-right"p>><"clear">',
                "oLanguage": {
                    "sLengthMenu": 'Itens por página: _MENU_',
                    "sZeroRecords": "Nenhum resultado foi encontrado",
                    "sInfo": '<span style="margin-right:100px">Página _PAGE_</span>   _START_ - _END_ / _TOTAL_',
                    "sInfoEmpty":' - ',
                    "sInfoFiltered": "",
                    "sProcessing":"Processando...",
                    "oPaginate": {
                        "sPrevious": '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
                        "sNext": '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
                    }
        
                }
            };
        };

        Table.prototype.show = function(){
            this.dataTable = this.selector.DataTable(this.settings);
            this.registerEvent();
        };

        Table.prototype.registerEvent = function(){
            
            _dataTable = this.dataTable;

            $('.input-search').on("keyup",function(e) {
                _dataTable.draw();
            });
        
            $('.btn-search').on("click",function(){
                _dataTable.draw();
            });
        };

        return Table;
    })();

    return {
        Table:Table
    };
});