// JavaScript Document
(function($){
	'use strict';

	//callback: callback to execute when row is clicked
	//download: true/false to show/hide download button
	//dltext: text for download button
	//dltooltip: tooltip text for download button
	$.fn.bsTable = function (callback, download, dltext, dltooltip, filter) {
		var $table;
		var $tableRows;
		var $tableRowsAndHeader;
		var $tableHeaders;
		var $tableBody;
		var $downloadIcon;
		var $downloadWrapper;
		var $downloadButton;
		var $filterMessage;
		var $filterRow;
		var $filterWrapper;
		var $filter;
		var cb;
		var dl;
		var dlClass;
		var flt;
		var fltClass;

		//set default values if parameter not passed
		download = typeof download !== 'undefined' ? download : false;
		dltext = typeof dltext !== 'undefined' ? dltext : ' Download';
		dltooltip = typeof dltooltip !== 'undefined' ? dltooltip : 'Click to download';
		filter = typeof filter !== 'undefined' ? filter : false;

		//set callback to execute when row is clicked
		cb = callback;
		//set download
		dl = download;
		//set filter
		flt = filter;

		if(dl === true) {
			dlClass = ''
		} else dlClass = 'display:none';

		if(flt === true) {
			fltClass = ''
		} else fltClass = 'display:none';

		//add class to identify as bstable
		$(this).addClass('bstable');

		//get table
		$table = $(this).find('table');
		//get table body rows
		$tableRows = $(this).find('tbody > tr');
		//alert($tableRows.length);
		//get table body rows with header
		$tableRowsAndHeader = $(this).find('table tr');
		//console.log($tableRowsAndHeader);
		//get table headers
		$tableHeaders = $(this).find('table th');
		//console.log($tableHeaders);
		$tableBody = $(this).find('table tbody');
		//console.log($tableBody);

		//set classes for table - bootstrap table classes
		$table.addClass('table table-bordered table-condensed table-hover');
		//highlight header row of table
		$table.find('th').parent().addClass('success');


		//download wrapper
		$downloadIcon = $('<span/>', {
			'class': 'glyphicon glyphicon-download'
		});
		//download wrapper
		$downloadWrapper = $('<div/>', {
			'class': 'col-md-offset-4 col-md-2'
		});
		//button to download table as csv file
		$downloadButton = $('<a/>', {
			'class': 'btn btn-default',
			'title': dltooltip,
			'style': dlClass,
			'data-toggle': 'tooltip',
			'click': function() {
				//alert('click');
                var now = new Date();
                var filename = 'data_base_' + now.getTime() + '.csv';
                // Temporary delimiter characters unlikely to be typed by keyboard
                // This is to avoid accidentally splitting the actual contents
                var tmpColDelim = String.fromCharCode(11); // vertical tab character
                var tmpRowDelim = String.fromCharCode(0); // null character

                // actual delimiter characters for CSV format
                var colDelim = '","';
                var rowDelim = '"\r\n"';

                // Grab text from table into CSV formatted string
                var csv = '"' + $tableRowsAndHeader.map(function (i, row) {
                    var $row = $(row);
                    var $cols = $row.find('th,td');

                    return $cols.map(function (j, col) {
                        var $col = $(col);
                        var text = $col.text();

                        return text.replace(/"/g, '""'); // escape double quotes

                    }).get().join(tmpColDelim);

                }).get().join(tmpRowDelim)
                    .split(tmpRowDelim).join(rowDelim)
                    .split(tmpColDelim).join(colDelim) + '"';

                // Data URI
                var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

                $(this).attr( {
                    'download': filename,
                    'href': csvData,
                    'target': '_blank'
                });
			}
		});
		//filter message - shows how many rows found
		$filterMessage = $('<p/>', {
			'class': 'col-md-3',
            'style': 'padding-top: 10px'
		});
		//row for filter
		$filterRow = $('<div/>', {
			'class': 'row',
            'style': 'padding-bottom: 5px'
		});
		//column for search box
		$filterWrapper = $('<div/>', {
			'class': 'pull-left col-md-3'
		});
		//add case insensitive selector
		$.expr[':'].icontains = function(a, i, m) {
		  return $(a).text().toUpperCase()
		      .indexOf(m[3].toUpperCase()) >= 0;
		};
		//search box
		$filter = $('<input/>', {
			 'class': 'form-control',
			 'style': fltClass,
			 'type': 'text',
			 'placeholder': 'Искать',
			 'keyup': function () {
				 	//hide all rows
					var $rows = $tableRows.hide();

					//if anything was entered into search box
					if (this.value.length) {
						//split search terms
						var data = this.value.split(",");
						//loop through each search term
						$.each(data, function (i, v) {
							//show row using case insensitive selector
							$rows.filter(":icontains('" + v + "')").show();
						});
						//update filter message to show how many rows found
						$filterMessage.text('Найдено записей: ' + $tableRows.parent().find('tr:visible').length);
					} else {
						//if nothing entered, show all rows
						$rows.show();
						//delete filter message
						$filterMessage.text('');
					}
				}
		});

		//add filter row above table
		this.prepend(
			$filterRow
				.append($filterWrapper.append($filter))
				.append($filterMessage)
				.append($downloadWrapper
					.append($downloadButton
						.append($downloadIcon)
						.append(dltext)
					)
				)
		);

		//click event for table rows
		$tableRows.click(function() {
			//return the row back to the function
			callback($(this));
		});

		//add click event for column headers

//		$tableHeaders.click(function() {
//			//get column index of click
//			var n = $(this)[0].cellIndex;
//			//cycle through sort options
//			  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
//			  table = $table[0];
//			  switching = true;
//			  //Set the sorting direction to ascending:
//			  dir = "asc";
//			  /*Make a loop that will continue until
//			  no switching has been done:*/
//			  while (switching) {
//			    //start by saying: no switching is done:
//			    switching = false;
//			    rows = table.getElementsByTagName("TR");
//			    /*Loop through all table rows (except the
//			    first, which contains table headers):*/
//			    for (i = 1; i < (rows.length - 1); i++) {
//			      //start by saying there should be no switching:
//			      shouldSwitch = false;
//			      /*Get the two elements you want to compare,
//			      one from current row and one from the next:*/
//			      x = rows[i].getElementsByTagName("TD")[n];
//			      y = rows[i + 1].getElementsByTagName("TD")[n];
//			      /*check if the two rows should switch place,
//			      based on the direction, asc or desc:*/
//			      if (dir == "asc") {
//			        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
//			          //if so, mark as a switch and break the loop:
//			          shouldSwitch= true;
//			          break;
//			        }
//			      } else if (dir == "desc") {
//			        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
//			          //if so, mark as a switch and break the loop:
//			          shouldSwitch= true;
//			          break;
//			        }
//			      }
//			    }
//			    if (shouldSwitch) {
//			      /*If a switch has been marked, make the switch
//			      and mark that a switch has been done:*/
//			      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
//			      switching = true;
//			      //Each time a switch is done, increase this count by 1:
//			      switchcount ++;
//			    } else {
//			      /*If no switching has been done AND the direction is "asc",
//			      set the direction to "desc" and run the while loop again.*/
//			      if (switchcount == 0 && dir == "asc") {
//			        dir = "desc";
//			        switching = true;
//			      }
//			    }
//			  }
//
//			  //set sorting to ascending
//			  //asc = 1;
//			  //console.log($tableBody[0]);
//	        //toggle sort order
//	        /* Grab Link ID and sort order */
//	        var linkID = $(this)[0].id.split("|");
//	        //console.log(linkID);
//
//	        /* Re-establish Caption, Header Link title attribute and ARIA sort attribute
//	        linkID[0] = Header Link Text, linkID[1] = Sort Text
//	        */
//	        if (linkID[1] == "asc") {
//	            $(this).attr("title", "Нисходящая сортировка " + linkID[0]);
//	            $(this)[0].id = linkID[0] + "|desc";
//	            dir=-1;
//	            //$(this).parent().attr("aria-sort", "ascending");
//	            //$("#simpleTable caption")[0].innerHTML = "Sports Cars Sorted by " + linkID[0] + ": Ascending Order";
//	            //$("#simpleTable caption").show();
//	        }
//	        else {
//	            $(this).attr("title", "Восходящая сортировка " + linkID[0]);
//	            $(this)[0].id = linkID[0] + "|asc";
//	            dir=1;
//	            //$(this).parent().attr("aria-sort", "descending");
//	            //$("#simpleTable caption")[0].innerHTML = "Sports Cars Sorted by " + linkID[0] + ": Descending Order";
//	            //$("#simpleTable caption").show();
//	        }
//        	sort_table($tableBody[0],n,dir);
//			//console.log($tableBody[0]);
//			//call function to refresh filters on table
//			//not on all pages
//			try {
//				filterRows();
//			}
//			catch(err) {
//			}
//		});




		function sort_table(tbody, col, asc)
		{
		    var rows = tbody.rows;
		    var rlen = rows.length;
		    var arr = new Array();
		    var i, j, cells, clen;
		    // fill the array with values from the table
		    for(i = 0; i < rlen; i++)
		    {
		        cells = rows[i].cells;
		        clen = cells.length;
		        arr[i] = new Array();
		      for(j = 0; j < clen; j++) { arr[i][j] = cells[j].innerHTML; }
		    }
		    //flip sort order based on first two rows
		    asc = ( arr[0][col] >= arr[1][col] ) ? asc : -1*asc;
		    // sort the array by the specified column number (col) and order (asc)
		    arr.sort(function(a, b)
		    {
		        var retval=0;
		        var fA=parseFloat(a[col]);
		        var fB=parseFloat(b[col]);
		        //console.log(fA);
		        //console.log(fB);
		        if(a[col] != b[col])
		        {
		            if((fA==a[col]) && (fB==b[col]) ){ retval=( fA > fB ) ? asc : -1*asc; } //numerical
		            else { retval=(a[col] > b[col]) ? asc : -1*asc;}
		        }
		        //retval=(a[col] > b[col]) ? asc : -1*asc;
		        return retval;
		    });
		    for(var rowidx=0;rowidx<rlen;rowidx++)
		    {
		        for(var colidx=0;colidx<arr[rowidx].length;colidx++){ tbody.rows[rowidx].cells[colidx].innerHTML=arr[rowidx][colidx]; }
		    }
		}

		//return this for chaining other functions
		return this;
	};
}(jQuery));
