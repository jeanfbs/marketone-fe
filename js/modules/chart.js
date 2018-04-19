define(function(){


    var BarChart = (function(){
        
      var selector = null;
      var ykeys = null;
      var xkey = null;
      var chartData = [];
      var settings = {};


      function BarChart(elem, data, opts){

        this.chartData = data;
        this.settings = opts;
        this.selector = elem;
        this.morrisObject = null;

        if(this.chartData.length > 0){
          this.xkey = Object.keys(this.chartData[0])[0];
          this.ykeys = Object.keys(this.chartData[0]).slice(1);
        }
      }

      var getLabel = function(dataObjectArray, rowArray){
          var newRowArray = [];
          var rowArrayLength = rowArray.length;
          var dataObjectArrayLength = dataObjectArray.length;

          for(var i = 0; i < rowArrayLength; i++){
            var index = 0;
            for(var j = 0; j < dataObjectArrayLength; j++){
              if(rowArray[i] == dataObjectArray[j]){
                index = j;
              }
            }

            var obj = {};
            obj.key = rowArray[i];
            obj.index = index;
            newRowArray.push(obj);
          }
          return newRowArray;
      };

      BarChart.prototype.show = function(){
        
        if(this.morrisObject != null){
          this.redraw();
          return false;
        }
        $.when(this).then(this.buildChart());
        $.when(this).then(this.buildCheckbox()).then(this.addHandlerLegend());
      };
    
      BarChart.prototype.reload =  function(fields){
        tempDataList = [];
        $.each(this.chartData, function(i, chartObjectData){
            other = Object.assign({}, chartObjectData);
    
            $.each(fields, function(i, field){
              delete other[field];
            });
            tempDataList.push(other);
          });
          this.morrisObject.setData(tempDataList);
      };
    
      BarChart.prototype.buildCheckbox = function(){
        var divLegend = $('<div class="variables text-center"></div>');
        var _settings = this.settings;
        
        $.each(this.ykeys, function(i, key){
          var legend = $('<label class="checkbox-inline text-capitalize"></label>')
          .append($('<input type="checkbox" checked class="checkLegend"></span>').val(key))
          .append(_settings.labels[i]).append($('<span class="legend">').css({"background-color" : _settings.barColors[i]}));
          
          divLegend.append(legend);
        });
        $("#" + this.selector).parent("div").append(divLegend);
      };
      
      BarChart.prototype.redraw = function(){
        this.morrisObject.redraw();
      };

      BarChart.prototype.addHandlerLegend = function(){
        var _this = this;
        $("#" + this.selector).parent("div").find(".checkLegend").off("click").on("click",function(e){
          var fields = [];
          var array = $(".checkLegend:not(:checked)").each(function(){
              fields.push($(this).val());
          });
          _this.reload(fields);
        });
      };
    
      BarChart.prototype.buildChart = function(){
        $("#" + this.selector).empty();
        var _ykeys = this.ykeys;
        if(this.chartData != null && this.chartData.length == 0){
          $("#" + this.selector).addClass("vertical-align")
          .append('<h4 class="text-danger"><i class="fa fa-exclamation-circle fa-fw" aria-hidden="true"></i> Não conseguimos encontrar nenhum resultados para exibir!</h4>');
          return false;
        }
        
        this.morrisObject =  Morris.Bar({
          element: this.selector,
          data: this.chartData,
          dataLabels:false,
          resize:true,
          barColors: this.settings.barColors,
          xkey: this.xkey,
          ykeys: this.ykeys,
          labels: this.settings.labels,
          hoverCallback: function(index, options, content, row){

              var morrisRowLabel = $("<div class='morris-hover-row-label'></div>").text(row.y);
              var contentTable = $("<table></table>").addClass("table table-bordered table-condensed");
              var tbody = $("<tbody></tbody>");
              var rowKeys = Object.keys(row).slice(1);
              var newRowArray = getLabel(_ykeys, rowKeys);
              
              $.each(newRowArray, function(i, obj){
                  
                  var line = $("<tr></tr>")
                  .append("<td class='text-left text-capitalize'>"+ options.labels[obj.index] + "</td>")
                  .append("<td><b>R$ "+ parseFloat(row[obj.key]).toLocaleString() + "</b></td>");
                  tbody.append(line);
              });
              contentTable.append(tbody);
              return morrisRowLabel[0].outerHTML + contentTable[0].outerHTML;
            }
        });
      };
      return BarChart;
    })();

     


    var Knob = (function(){

      var selector = null;
      var value = null;
      var knobObject = null;
      var formatter = null;

      function Knob(selector, value, formatter){
        this.selector = selector;
        this.value = value;
        this.formatter = formatter;
      }

      var getMaxValue = function(value){
        
        var aux = value;
        var maxValue = 1;
        while(aux > 1){
          maxValue *= 10;
          aux = value / maxValue;
        }

        return maxValue;
      };

      Knob.prototype.create = function(){
        
        var _value = this.value;
        var maxValue = getMaxValue(_value);
        if(_value == null || _value == undefined){
            $(this.selector).addClass("hide");
            $(this.selector).parent("div").addClass("vertical-align").css({"width": "100%", "height": 150})
            .append('<h4 class="text-danger"><i class="fa fa-exclamation-circle fa-fw" aria-hidden="true"></i> Não conseguimos encontrar nenhum resultados para exibir!</h4>');
            return false;
        }
        
        this.knobObject = $(this.selector).knob({
          width: 150,
          height: 150,
          angleOffset: 180,
          max: maxValue,
          fgColor: "#FFA739",
          inputColor: "#222",
          skin: "tron",
          thickness: ".2",
          readOnly: true,
          fontWeight: 400,
          format: this.formatter,
          draw: function(){
            setFont(_value, this.i[0]);
          }
      });
      
    };

    var setFont = function(value, input){
      var size = 0;
      if(value > 1000){
          size = 11;
      }else if(value > 100){
        size = 14;
      }else if(value > 10){
        size = 15;
      }
      input.style.fontSize = size + 'pt';
      input.style.fontWeight = 'bold';
    }

    Knob.prototype.show = function(){
      if(this.knobObject != null){
        return false;
      }
      $.when(this.create()).then(this.animate());
    };

    Knob.prototype.animate = function(){
      var selector = this.selector;
      var value = this.value;
      
      if(value == null || value == undefined){
        return false;
      }

      $(selector).animate({
        value: value
      }, {
        duration: 3000,
        easing:'swing',
        progress: function(){
          $(this).val(parseFloat($(selector).val()).toFixed(2)).trigger('change');
          if($(this).hasClass("hide")){
            $(this).removeClass("hide");
          }
        }
      });
    };
      return Knob;
    })();


    var Donut = (function(){

      var selector = null;
      var data = null;
      var donutObject = null;

      function Donut(selector, data){
        this.selector = selector;
        this.data = data;
      }

      Donut.prototype.create = function(){

        this.donutObject = Morris.Donut({
          element: this.selector,
          data: this.data,
          colors:["#F57F17", "#FFAB00", "#FFD600"],
          formatter: function(y, data){
            return "R$ " + data.value.toLocaleString();
          },
          resize: true,
          showPercentage: true
        });
      };

      Donut.prototype.redraw = function(){
        this.donutObject.redraw();
      };

      Donut.prototype.show = function(){
          if(this.donutObject != null){
            this.redraw();
            return false;
          }
          this.create();
      };
      
      return Donut;

    })();

    return {
      BarChart: BarChart,
      Knob: Knob,
      Donut: Donut
    };
    
});