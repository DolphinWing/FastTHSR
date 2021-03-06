
var storage = chrome.storage.local;

//sync chrome extension config with Chrome Sync
//https://developer.chrome.com/extensions/storage.html#property-sync
//http://stackoverflow.com/a/14533446/2673859

// Saves options to localStorage.
function save_options() {
	if(document.getElementById("user_id").value==""||
		document.getElementById("station_home").value==""||
		document.getElementById("station_away").value==""||
		//document.getElementById("e_mail").value==""||
		document.getElementById("mobile_phone").value=="") 
	{
		show_status("incomplete form!");
		return false;
	}
		
	var stat = parseInt(document.getElementById("station_home").value);
	if(stat < 0 || stat >=10) {
		show_status("incorrect station");
		return false;
	}
	stat = parseInt(document.getElementById("station_away").value);
	if(stat < 0 || stat >=10) {
		show_status("incorrect station");
		return false;
	}
	var uid = document.getElementById("user_id").value;
	var regex = new RegExp("[\\D]{1}[\\d]{9}", "g");
	var m = uid.match(regex);
	if(m == null || m=="") {
		show_status("incorrect UID");
		return false;
	}
	
//	localStorage["user_id"] = document.getElementById("user_id").value;
//	localStorage["station_home"] = document.getElementById("station_home").value;
//	localStorage["station_away"] = document.getElementById("station_away").value;
//	localStorage["mobile_phone"] = document.getElementById("mobile_phone").value;
//	localStorage["e_mail"] = document.getElementById("e_mail").value;
//	
//	//[0.4.0]++
//	localStorage["time_table"] = document.getElementById("timeTable").value;
//	localStorage["holiday"] = document.getElementById("holiday").value;
//	localStorage["enable_holiday"] = document.getElementById("enable_holiday").checked ? "1" : "0";
//
//	show_status("Options Saved.");

	var data = {};
	data.user_id = document.getElementById("user_id").value;
	data.station_home = document.getElementById("station_home").value;
	data.station_away = document.getElementById("station_away").value;
	data.mobile_phone = document.getElementById("mobile_phone").value;
	data.e_mail = document.getElementById("e_mail").value;
	data.time_table = document.getElementById("timeTable").value;
	data.holiday = document.getElementById("holiday").value;
	data.enable_holiday = document.getElementById("enable_holiday").checked ? "1" : "0";
	
	//var storage = chrome.storage.local;
	storage.set({'data': data}, function() {
		// Notify that we saved.
		show_status('Options saved');
	});
	
	// Save it using the Chrome extension storage API.
	chrome.storage.sync.set({'data': data}, function() {
		// Notify that we saved.
		show_status('Options saved to cloud.');
	});
}

var status_timer = 0;
function show_status(msg){
	if(status_timer>0)window.clearTimeout(status_timer);
	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = msg;
	status_timer = window.setTimeout(function() {
		status.innerHTML = "";
	}, 2000);
}

function updateOptionUI(data){
	document.getElementById("user_id").value           	= data.user_id;
	document.getElementById("station_home").value      	= data.station_home;
	document.getElementById("selectHomeStation").value  = document.getElementById("station_home").value;
	document.getElementById("station_away").value 		= data.station_away;
	document.getElementById("selectAwayStation").value  = document.getElementById("station_away").value;
	document.getElementById("mobile_phone").value     	= data.mobile_phone;
	document.getElementById("e_mail").value       		= data.e_mail;
	document.getElementById("holiday").value     		= data.holiday;
	document.getElementById("timeTable").value       	= data.time_table;
	document.getElementById("enable_holiday").checked   = (data.enable_holiday == "1");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	show_status("Options loading...");
//	var user_id = localStorage["user_id"];
//	if (!user_id) {
//		return;
//	}
	
//	document.getElementById("user_id").value = user_id;
//	document.getElementById("station_home").value = localStorage["station_home"];
//	document.getElementById("selectHomeStation").value = document.getElementById("station_home").value;
//	document.getElementById("station_away").value = localStorage["station_away"];
//	document.getElementById("selectAwayStation").value = document.getElementById("station_away").value;
//	document.getElementById("mobile_phone").value = localStorage["mobile_phone"];
//	//alert(document.getElementById("mobile_phone").value);
//	document.getElementById("e_mail").value = localStorage["e_mail"];
//	//[0.4.0]++
//	document.getElementById("holiday").value = localStorage["holiday"];
//	document.getElementById("timeTable").value = localStorage["time_table"];
//	document.getElementById("enable_holiday").checked = (localStorage["enable_holiday"]=="1");
//	holiday_change();

	//var storage = chrome.storage.local;
	storage.get('data', function(items) {
		if (items.data) {
//			document.getElementById("user_id").value           	= items.data.user_id;
//			document.getElementById("station_home").value      	= items.data.station_home;
//			document.getElementById("selectHomeStation").value  = document.getElementById("station_home").value;
//			document.getElementById("station_away").value 		= items.data.station_away;
//			document.getElementById("selectAwayStation").value  = document.getElementById("station_away").value;
//			document.getElementById("mobile_phone").value     	= items.data.mobile_phone;
//			document.getElementById("e_mail").value       		= items.data.e_mail;
//			document.getElementById("holiday").value     		= items.data.holiday;
//			document.getElementById("timeTable").value       	= items.data.time_table;
//			document.getElementById("enable_holiday").checked   = (items.data.enable_holiday == "1");
			updateOptionUI(items.data);
			show_status('Options loaded.');
		} else {//no local data
			chrome.storage.sync.get('data', function(items) {
				// Notify that we saved.
				updateOptionUI(items.data);
				show_status('Options loaded from cloud.');
			});
		}
		
		holiday_change();
	});
}

function station_change(id,srcId){
	document.getElementById(id).value=document.getElementById(srcId).value;
}

function holiday_change(){
	if(document.getElementById("enable_holiday").checked){
		document.getElementById("row_date").style.display="";
		document.getElementById("row_time").style.display="";
	}
	else{
		document.getElementById("row_date").style.display="none";
		document.getElementById("row_time").style.display="none";
	}
}

function home_change(){station_change('station_home','selectHomeStation');}
function away_change(){station_change('station_away','selectAwayStation');}

var submitButton = document.querySelector('button#btn_save');
submitButton.addEventListener('click', save_options);

var stationAway = document.querySelector('select#selectAwayStation');
stationAway.addEventListener('change', away_change);
var stationHome = document.querySelector('select#selectHomeStation');
stationHome.addEventListener('change', home_change);

var enableHoliday = document.querySelector('input#enable_holiday');
enableHoliday.addEventListener('click', holiday_change);

restore_options();

var picker = new Pikaday(
    {
        field: document.getElementById('holiday'),
        firstDay: 1,
		format: 'YYYY/MM/DD',
        minDate: new Date(),
        maxDate: new Date('2020-12-31'),
        yearRange: [2013,2020]
    });
