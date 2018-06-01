define(function(){

    var Table = (function(){

        var settings = null;
        var dataTable = null;
        var selector = null;
        var exportLinks = null;

        function Table(selector, opts, exportLinks){
            
            this.selector = selector;
            this.exportLinks = exportLinks;
            if(opts == null || opts == undefined) return;

            this.settings = makeDefaultSettings();
            this.settings.bServerSide = ('bServerSide' in opts) ? opts.bServerSide: false;
            if('columns' in opts){
                this.settings.columns = opts.columns;
            }
            if('columnDefs' in opts){
                this.settings.columnDefs = opts.columnDefs;
            }
            
            this.settings.aaSorting =  (opts.aaSorting == undefined) ? [[ 1, 'asc' ]] : opts.aaSorting;
            
            if('ajax' in opts){
                this.settings.ajax = Object.assign({}, opts.ajax);
                delete this.settings.ajax.data;
            }
            
            if('data' in opts.ajax){
                
                this.settings.ajax.data = function(d){
                    delete d.search;
                    opts.ajax.data(d);
                    planify(d);
                };
            }
        }

        var planify = function(data) {
            for (var i = 0; i < data.columns.length; i++) {
                column = data.columns[i];
                column.searchRegex = column.search.regex;
                column.searchValue = column.search.value;
                delete(column.search);
            }
        };
        
        var makeDefaultSettings = function(){
            return {
                'lengthMenu': [[10,25,50, -1], [10,25,50, 'Todos']],
                'scrollX': true,
                'scrollY': '80vh',
                'scrollCollapse': true,
                'pagingType': 'simple',
                'sDom': '<"rowDT text-primary" <"col-md-3 col-sm-3 col-xs-8"l> <"col-md-2 col-sm-2 hidden-xs export"><"col-md-5 col-sm-5 hidden-xs text-right"i><"col-md-2 col-xs-4 text-right"p>><"clear">rt<"rowDT text-primary"<"#buttons.col-md-3 col-sm-3 col-xs-8"l> <"col-md-2 col-sm-2 hidden-xs"><"col-md-5 col-sm-5 hidden-xs text-right"i><"col-md-2 col-xs-4 text-right"p>><"clear">',
                'oLanguage': {
                    'sLengthMenu': 'Itens por página: _MENU_',
                    'sZeroRecords': 'Nenhum resultado foi encontrado',
                    'sInfo': '<span style="margin-right:100px">_START_ - _END_ / _TOTAL_</span>  Página _PAGE_',
                    'sInfoEmpty':' - ',
                    'sInfoFiltered': '',
                    'sProcessing':'Processando...',
                    'oPaginate': {
                        'sPrevious': '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
                        'sNext': '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
                    }
        
                }
            };
        };

        Table.prototype.makeExportMenu = function(){
            
            if(this.exportLinks == null && this.exportLinks == undefined){
                return false;
            }
            var exportMenu = '<div class="dropdown">'+
            '<button class="btn btn-default btn-sm dropdown-toggle" type="button" id="menu-exportar" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><i class="fa fa-download fa-fw" aria-hidden="true"></i> Exportar <span class="caret"></span></button>'+
                '<ul class="dropdown-menu" aria-labelledby="menu-exportar">';
                
            if(this.exportLinks[0] != undefined && this.exportLinks[0] != null){
                exportMenu += '<li><a href="'+ this.exportLinks[0] +'"><i class="fa fa-file-excel-o" aria-hidden="true"></i> Excel</a></li>';
            }

            if(this.exportLinks[1] != undefined && this.exportLinks[1] != null){
                exportMenu += '<li><a href="'+ this.exportLinks[1] +'"><i class="fa fa-file-pdf-o" aria-hidden="true"></i> PDF</a></li>';
            }
            
            if(this.exportLinks[2] != undefined && this.exportLinks[2] != null){
                exportMenu += '<li><a href="'+ this.exportLinks[2] +'"><i class="fa fa-file-text-o" aria-hidden="true"></i> CSV</a></li>';
            }

            exportMenu += '</ul></div>';
            $(".export").html(exportMenu);
        };

        Table.prototype.show = function(){
            this.dataTable = this.selector.DataTable(this.settings);
            this.registerEvents();
            this.makeExportMenu();
        };

        Table.prototype.redraw = function(){
            this.dataTable.draw();
        };

        Table.prototype.registerEvents = function(){
            
            _dataTable = this.dataTable;

            $('#input-search').on("keyup",function(e) {
                _dataTable.draw();
            });
        
            $('#btn-search').on("click",function(){
                _dataTable.draw();
            });
            
        };

        return Table;
    })();

    return {
        Table:Table
    };
});