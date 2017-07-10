(function() {
	'use strict';

	var grid = $('#grid_list');

	grid.jqGrid({
		url:'api/logs',
		mtype: 'POST',
		datatype: "json",
		colModel:[
			{
				label: 'ID',
				name: 'id',
				searchoptions: {
					sopt: ['eq']
				},
				hidden: true
			},
			{
				label: 'Date',
				name: 'date',
				formatter: 'date',
				formatoptions: {
					srcformat: 'Y-m-d H:i:s',
					newformat: 'Y-m-d H:i:s'
				}
			},
			{
				label: 'Level',
				name: 'level',
				stype:"select",
				searchoptions: {
					clearSearch: false,
					attr: { multiple: 'multiple', size: 4 },
					sopt: ['eq'],
					value: ":All;info:Info;warning:Warning;debug:Debug;error:Error;fatal:Fatal"
				}

			},
			//{
			//	label: 'Type',
			//	name: 'type'
			//},
			{
				label: 'Message',
				name: 'message'
			},
			//{
			//	label: 'Exception',
			//	name: 'exception',
			//	formatter: linkFormatter
			//}
		],
		multipleSearch: false,
		viewrecords: true,
		pager: "#grid_pager",
		shrinkToFit: true,
		sortname: 'date',
        sortorder: 'desc',
		caption: "CR jqGrid",
		rowNum: 50,
		rowList: [10,50,100],
		rownumbers: true,
		height: 'auto',
		jsonReader : {
			root: "rows",
			page: "page",
			total: "total",
			records: "records",
			repeatitems: true,
			id: "id",
			userdata: "userdata",
			subgrid: {root:"rows",
				repeatitems: true,
				cell:"cell"
			}
		},
		loadComplete: function() {
			var ids = $(this).jqGrid("getDataIDs"), 
				len = ids.length;

			for (var i = 0; i < len; i++) {
				var rowid = ids[i],
					status = $(this).jqGrid("getCell", rowid, "level"),
					curRow = $('#' + $.jgrid.jqID(rowid));
				
				switch (status) {
					case 'info':
						curRow.addClass('row-info');
						break;
					case 'warning':
						curRow.addClass('row-warning');
						break;
					case 'debug':
						curRow.addClass('row-debug');
						break;
					case 'error':
						curRow.addClass('row-error');
						break;
					case 'fatal':
						curRow.addClass('row-fatal');
						break;
					default: 
						break;
				}
			}

			$('#gs_date').daterangepicker({dateFormat:'yy-mm-dd'});

			$('.fancybox').fancybox({

			});

			$(window).resize();
		}
	});

	grid.jqGrid('filterToolbar',{searchOperators : true});

	grid.jqGrid('navGrid', '#grid_pager', {
		edit: false,
		add: false,
		del: false,
		search: false, 
		refresh: false
	});

	function linkFormatter(cellvalue, options, rowObject) {
		if ( cellvalue !== '' ) {
			var html =  '<a class="fancybox" href="#popup-' + rowObject.id + '">View exception</a>' +
						'<div class="ex-popup" rel="exceptions" id="popup-' + rowObject.id + '">' + rowObject.exception + '</div>';

			return html;
		} else {
			return '';
		}
	}

	$(window).on("resize", function () {
		var newWidth = grid.closest(".ui-jqgrid").parent().width();

		grid.jqGrid("setGridWidth", newWidth, true);
	});


})();


function log(msg) {
	console.log(msg);
}