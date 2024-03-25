/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.71081073018536, "KoPercent": 0.2891892698146416};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9963891098440539, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Quantity Request "], "isController": false}, {"data": [0.9843657233326737, 500, 1500, "Comment history"], "isController": false}, {"data": [1.0, 500, 1500, "Goto GuestBook"], "isController": false}, {"data": [0.9468610823012629, 500, 1500, "Send Comments"], "isController": true}, {"data": [1.0, 500, 1500, "Goto Project"], "isController": true}, {"data": [1.0, 500, 1500, "Login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "Authorization"], "isController": false}, {"data": [1.0, 500, 1500, "Goto SC"], "isController": true}, {"data": [1.0, 500, 1500, "Logout"], "isController": false}, {"data": [1.0, 500, 1500, "Clear the database"], "isController": false}, {"data": [1.0, 500, 1500, "403 Project"], "isController": false}, {"data": [1.0, 500, 1500, "Goto Homepage"], "isController": true}, {"data": [1.0, 500, 1500, "Homepage"], "isController": false}, {"data": [1.0, 500, 1500, "401 Homepage"], "isController": false}, {"data": [1.0, 500, 1500, "Guestbook"], "isController": false}, {"data": [0.9514672686230248, 500, 1500, "Send Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Login"], "isController": false}, {"data": [1.0, 500, 1500, "Login SC"], "isController": true}, {"data": [0.9980449768335405, 500, 1500, "Goto Guestbook"], "isController": true}, {"data": [1.0, 500, 1500, "Authorization-0"], "isController": false}, {"data": [1.0, 500, 1500, "Authorization-1"], "isController": false}, {"data": [1.0, 500, 1500, "SOAP Request"], "isController": false}, {"data": [1.0, 500, 1500, "Select Clients"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 569869, 1648, 0.2891892698146416, 1.6096436198494761, 0, 803, 1.0, 2.0, 3.0, 4.0, 1899.5443378899542, 8718.074056238605, 981.9502195603044], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Quantity Request ", 28592, 0, 0.0, 0.37206211527700184, 0, 201, 0.0, 1.0, 1.0, 1.0, 95.59216861024927, 0.7970648116959319, 0.0], "isController": false}, {"data": ["Comment history", 60636, 860, 1.4182993601161027, 4.483656573652661, 0, 803, 1.0, 1.0, 1.0, 3.0, 202.16447618476067, 295.894878774372, 60.21500511362499], "isController": false}, {"data": ["Goto GuestBook", 16392, 0, 0.0, 2.1920448999512043, 1, 33, 2.0, 3.0, 3.0, 4.0, 54.79910005382293, 220.07744777336868, 22.04807541228032], "isController": false}, {"data": ["Send Comments", 16391, 860, 5.2467817704838025, 4.477518150204386, 0, 1021, 2.0, 3.0, 6.0, 9.0, 54.800703438960625, 100.23000880552455, 55.37450434968673], "isController": true}, {"data": ["Goto Project", 29886, 0, 0.0, 4.31084788864348, 2, 66, 4.0, 6.0, 6.0, 7.0, 99.62498124906246, 3359.4244165333266, 82.50159252754304], "isController": true}, {"data": ["Login-0", 29886, 0, 0.0, 0.33125878337682924, 0, 30, 0.0, 1.0, 1.0, 1.0, 99.69576878427605, 33.97834307198471, 56.95510228398583], "isController": false}, {"data": ["Login-1", 29886, 0, 0.0, 0.5619018938633471, 0, 31, 1.0, 1.0, 1.0, 1.0, 99.69876202199737, 133.58076317791057, 51.991346601315044], "isController": false}, {"data": ["Logout-1", 29885, 0, 0.0, 0.5630249288941008, 0, 254, 1.0, 1.0, 1.0, 1.0, 99.70340863217666, 93.35118623514958, 52.57796939587441], "isController": false}, {"data": ["Logout-0", 29885, 0, 0.0, 0.3486029780826527, 0, 30, 0.0, 1.0, 1.0, 1.0, 99.70374126737352, 27.457475622460283, 53.94128189660637], "isController": false}, {"data": ["Authorization", 29886, 0, 0.0, 0.8939971893194107, 0, 33, 1.0, 1.0, 1.0, 2.0, 99.68878526183066, 113.00290038668348, 88.97985638736561], "isController": false}, {"data": ["Goto SC", 29886, 0, 0.0, 0.8941644917352606, 0, 33, 1.0, 1.0, 1.0, 2.0, 99.68878526183066, 113.00290038668348, 88.97985638736561], "isController": true}, {"data": ["Logout", 29885, 0, 0.0, 0.9496068261669756, 0, 254, 1.0, 1.0, 1.0, 2.0, 99.70307599919931, 120.80816720845566, 106.51871596008206], "isController": false}, {"data": ["Clear the database", 740, 0, 0.0, 0.4351351351351351, 0, 3, 0.0, 1.0, 1.0, 1.0, 2.4880054601633343, 0.02429692832190756, 0.0], "isController": false}, {"data": ["403 Project", 29886, 0, 0.0, 1.9908987485779486, 1, 27, 2.0, 3.0, 3.0, 4.0, 99.68712266259281, 1154.8714220179088, 43.515592816871695], "isController": false}, {"data": ["Goto Homepage", 27853, 0, 0.0, 2.5497791979320006, 1, 256, 2.0, 3.0, 3.0, 4.0, 93.0586089152907, 2059.9386711467528, 31.625386623555826], "isController": true}, {"data": ["Homepage", 44245, 0, 0.0, 2.5019324217425623, 1, 256, 2.0, 3.0, 3.0, 4.0, 147.87767379679144, 3271.3229549632356, 53.572430126169785], "isController": false}, {"data": ["401 Homepage", 29886, 0, 0.0, 2.31974837716655, 1, 60, 2.0, 3.0, 3.0, 4.0, 99.66684341640571, 2206.1995505074888, 39.02951900414028], "isController": false}, {"data": ["Guestbook", 27853, 0, 0.0, 2.1375435321150387, 1, 34, 2.0, 3.0, 3.0, 4.0, 93.1114944373128, 373.9180885220267, 36.37167751457531], "isController": false}, {"data": ["Send Comment", 16391, 788, 4.80751631993167, 2.572387285705579, 0, 714, 1.0, 2.0, 5.0, 7.0, 54.80363507486141, 17.039942368165008, 39.05411834409668], "isController": false}, {"data": ["Login", 29886, 0, 0.0, 0.9455263334002503, 0, 32, 1.0, 1.0, 1.0, 2.0, 99.69576878427605, 167.5550957790421, 108.94488795859854], "isController": false}, {"data": ["Login SC", 29885, 0, 0.0, 3.8438012380792888, 1, 257, 4.0, 4.0, 5.0, 6.0, 99.69509347353252, 349.31731581969484, 271.82490329892846], "isController": true}, {"data": ["Goto Guestbook", 44245, 0, 0.0, 9.311063396993935, 1, 820, 4.0, 8.0, 9.0, 15.0, 147.4282934371168, 2339.0802297090336, 147.90625627369948], "isController": true}, {"data": ["Authorization-0", 29886, 0, 0.0, 0.36435120123134707, 0, 32, 0.0, 1.0, 1.0, 1.0, 99.68911778833323, 26.869570323966286, 44.489990273464606], "isController": false}, {"data": ["Authorization-1", 29886, 0, 0.0, 0.4923040888710463, 0, 26, 0.0, 1.0, 1.0, 1.0, 99.6931082794049, 86.13715487711823, 44.4919438317266], "isController": false}, {"data": ["SOAP Request", 29885, 0, 0.0, 1.9486364396854632, 1, 29, 2.0, 2.0, 2.0, 4.0, 99.7004150152795, 60.96811425764309, 56.3735745057098], "isController": false}, {"data": ["Select Clients", 16392, 0, 0.0, 2.206381161542221, 1, 35, 2.0, 3.0, 3.0, 4.0, 54.797084976933874, 328.30101891046, 23.973724677408573], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Просто супер! Всем рекомендую. '&lt;br&gt;/", 161, 9.769417475728156, 0.028252107063202244], "isController": false}, {"data": ["Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Отличный сервис и быстрое решение проблемы. '&lt;br&gt;/", 153, 9.283980582524272, 0.026848275656335054], "isController": false}, {"data": ["500", 788, 47.81553398058252, 0.13827739357641844], "isController": false}, {"data": ["Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Отличные ребята. Благодарю за отличную работу! '&lt;br&gt;/", 141, 8.555825242718447, 0.024742528546034263], "isController": false}, {"data": ["Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Спасибо! Рекомендую, это лучшая компания на свете. '&lt;br&gt;/", 145, 8.798543689320388, 0.02544444424946786], "isController": false}, {"data": ["Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Очень доволен работой компании. Спасибо большое! '&lt;br&gt;/", 151, 9.162621359223301, 0.026497317804618253], "isController": false}, {"data": ["Response was null", 109, 6.614077669902913, 0.019127202918565494], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 569869, 1648, "500", 788, "Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Просто супер! Всем рекомендую. '&lt;br&gt;/", 161, "Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Отличный сервис и быстрое решение проблемы. '&lt;br&gt;/", 153, "Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Очень доволен работой компании. Спасибо большое! '&lt;br&gt;/", 151, "Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Спасибо! Рекомендую, это лучшая компания на свете. '&lt;br&gt;/", 145], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Comment history", 60636, 860, "Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Просто супер! Всем рекомендую. '&lt;br&gt;/", 161, "Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Отличный сервис и быстрое решение проблемы. '&lt;br&gt;/", 153, "Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Очень доволен работой компании. Спасибо большое! '&lt;br&gt;/", 151, "Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Спасибо! Рекомендую, это лучшая компания на свете. '&lt;br&gt;/", 145, "Test failed: text expected to contain /&lt;b&gt;Центральный банк Российской Федерации&lt;/b&gt;: 'Отличные ребята. Благодарю за отличную работу! '&lt;br&gt;/", 141], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Send Comment", 16391, 788, "500", 788, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
