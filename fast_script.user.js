// ==UserScript==
// @name            FastTHSR script
// @namespace       http://dolphinwing.pixnet.net/blog
// @description     2011/12/23
// @include         https://irs.thsrc.com.tw/IMINT
// author: dolphin

var PERSON_ID="";//Personal ID
var FROM_STATION="0";//starting station code
var TO_STATION="6";//destination station code
var MOBILE_PHONE="";//mobile phone
var E_MAIL="";//e-mail address
var EnableHoliday=0;
var Holiday="2013/01/22";
var TimeTable="";

//var pageState = location.href.split('/')[3];//alert(pageState);
//alert(location.href);
//var bRegisterButtons=true;

var bt_style="font-size:16px;width:100px;margin: 0 10px 0 10px;font-family:Arial;";
var pd_style="padding: 5px 0;_background:#ccf;border:solid 0px #ffc; text-align:right;";
var pd_style_p1="float:left;";

var person_id=null,from_station=null,to_station=null;

var storage = chrome.storage.local;
storage.get('data', function(items) {
		// To avoid checking items.css we could specify storage.get({css: ''}) to
		// return a default value of '' if there is no css value yet.
		if (items.data) {
			PERSON_ID     = items.data.user_id;
			FROM_STATION  = items.data.station_home;
			TO_STATION    = items.data.station_away;
			MOBILE_PHONE    = items.data.mobile_phone;
			E_MAIL      = items.data.e_mail;
			EnableHoliday  = (items.data.enable_holiday == "1") ? 1 : 0;;
			Holiday   = items.data.holiday;
			TimeTable = items.data.time_table;
			//show_status('Options loaded.');
			console.log("Options loaded.");
			//[1.3.2]-- do_action();
		} else {
			console.log("default values loaded.");
		}
		do_action();
	});

function get_id() {
	var i=0;
//	var inputText=document.getElementsByTagName("input");
//	for(i=0;i<inputText.length;i++){
//		if(inputText[i].name=="person_id"||inputText[i].name=="personId"){
//			person_id=inputText[i];break;
//		}
//	}
	var selectOpt=document.getElementsByTagName("select");
	for(i=0;i<selectOpt.length;i++){
		if(selectOpt[i].name=="selectStartStation")from_station=selectOpt[i];
		if(selectOpt[i].name=="selectDestinationStation")to_station=selectOpt[i];
	}
}

function do_action() {
//	if(person_id==null) {
//		get_id();
//		if(person_id==null || person_id=="undefined")
//			return false;
//	}
	var mydiv = document.createElement('div');
	mydiv.style.cssText=pd_style;//+pd_style_p1;
	//alert(mydiv.style.cssText);
	//document.body.appendChild(mydiv);
	//alert(document.getElementById("action"));
	if(document.getElementById("content")!=null) {
		document.getElementById("content").appendChild(mydiv);
		//document.insertBefore(mydiv,document.getElementById("action"));
		
		var mybt = document.createElement('input');
		mybt.type="button";
		mybt.style.cssText="margin: 0 10px 0 0;";//bt_style;
		mybt.className="button_main";
		mybt.value="Step 1";
		mybt.addEventListener('click', function(){
				//if(from_station!=null)from_station.value=FROM_STATION;
				//if(to_station!=null)to_station.value=TO_STATION;
				var selectOpt=document.getElementsByTagName("select");
				for(i=0;i<selectOpt.length;i++){
					if(selectOpt[i].name=="selectStartStation")//from_station=selectOpt[i];
						selectOpt[i].value=FROM_STATION;
					if(selectOpt[i].name=="selectDestinationStation")//to_station=selectOpt[i];
						selectOpt[i].value=TO_STATION;
					if((EnableHoliday == 1) && selectOpt[i].name=="toTimeTable")
						selectOpt[i].value=TimeTable;
				}
				//var inputBox=document.getElementsByTagName("input");
				//for(i=0;i<inputBox.length;i++){
				//	if(inputBox[i].name=="toTimeInputField"){
				//		inputBox[i].value=MOBILE_PHONE;
				//	}
				//}
				if(EnableHoliday == 1)
					document.getElementById("toTimeInputField").value=Holiday;
			}, false);
		mydiv.appendChild(mybt);
		
		mybt = document.createElement('input');
		mybt.type="button";
		mybt.style.cssText="margin: 0;";//bt_style;
		mybt.className="button_main";
		mybt.value="Step 3";
		mybt.addEventListener('click', function(){
				if(document.getElementById("idNumber")!=null){
					document.getElementById("idNumber").value=PERSON_ID;
					//document.getElementById("name24322").value=MOBILE_PHONE;
					//document.getElementById("name2622").value=E_MAIL;
					try{
						var inputBox=document.getElementsByTagName("input");
						for(i=0;i<inputBox.length;i++){
							if(inputBox[i].id=="mobileInputRadio" && !inputBox[i].checked){
								inputBox[i].click();
							}//[0.5.2]++ 2013-04-04, add check radio button, use id
							if(inputBox[i].id=="mobilePhone"){//[0.5.2]++ 2013-04-04, now use id
								//alert(MOBILE_PHONE);
								inputBox[i].value=MOBILE_PHONE;
							}
							if(inputBox[i].name=="email"){
								inputBox[i].value=E_MAIL;
							}
							if(inputBox[i].name=="agree"){
								inputBox[i].checked=true;
								//[0.5.2]-- 2013-04-04 break;
							}
							if(inputBox[i].name=="securityCode"){
								inputBox[i].focus();
							}//[0.5.2]++ 2013-04-04, foucs in security code box
						}
					}catch(e){alert("error: "+e)}
				}
				if(document.getElementById("rocId")!=null)
					document.getElementById("rocId").value=PERSON_ID;
			}, false);
		mydiv.appendChild(mybt);
		
//		mybt = document.createElement('input');
//		mybt.type="button";
//		mybt.value="Options";
//		mybt.addEventListener('click', function(){
//				chrome.tabs.create({'url': chrome.extension.getURL('options.html')}, function(tab) {
//				  // Tab opened.
//				});
//			}, false);
//		mydiv.appendChild(mybt);
	}
}
/*
//options, contentscript.js, background.html, asynchronous, localStorage, and race condition
//https://groups.google.com/a/chromium.org/group/chromium-extensions/browse_thread/thread/d738257374b50dbc
chrome.extension.sendRequest({method: "user_id"}, function(response) { 
	//alert('ALERT: ' + response.data); 
	if(response.data) PERSON_ID = response.data;
	if(PERSON_ID) 
		chrome.extension.sendRequest({method: "station_home"}, function(response) { 
			//alert('ALERT: ' + response.data); 
			FROM_STATION = response.data;//alert(FROM_STATION);
			
			chrome.extension.sendRequest({method: "station_away"}, function(response) { 
				//alert('ALERT: ' + response.data); 
				TO_STATION = response.data;

				chrome.extension.sendRequest({method: "mobile_phone"}, function(response) { 
					//alert('ALERT: ' + response.data); 
					MOBILE_PHONE = response.data;

					chrome.extension.sendRequest({method: "e_mail"}, function(response) { 
						//alert('ALERT: ' + response.data); 
						E_MAIL = response.data;
						
						chrome.extension.sendRequest({method: "enable_holiday"}, function(response) { 
							//alert('enable_holiday: ' + response.data); 
							EnableHoliday = (response.data == "1") ? 1 : 0;
							if(EnableHoliday == 1)//need holiday data
								chrome.extension.sendRequest({method: "holiday"}, function(response) { 
									Holiday = response.data;
									chrome.extension.sendRequest({method: "time_table"}, function(response) { 
										TimeTable = response.data;
										do_action();
									});
								});
							else//just for normal days
								do_action();
						});
					});
				});
			});
		});
}); 
*/
//if(pageState=="check_csearch.jsp" || pagetState=="check_ctno1.jsp") {
//	
// /*
//	var tmp = document.body.innerHTML;
////	alert(navigator.appName);
//	//alert(pageState+"\n"+tmp.substring(750, 1250));
//	var tmp1 = document.createElement('div');
//	tmp1.innerText = tmp;
//	document.body.appendChild(tmp1);
// */
//	
////	chrome.windows.onFocusChanged.addListener(function(windowId) {
////		alert("!");
////	});
//}
//else {
//alert(bRegisterButtons);
//if(bRegisterButtons) {//[1.1.0.6]@2011-06-13
	//[1.1.0.6]-- 
	//if(pageState.length>10) {
	//	var tmp = pageState.substring(0,10);//alert(tmp);
	//	if(tmp == "check_ctno") {//[1.1.0.2]jimmy++
	//		//alert("!!");
	//	}
	//	else {
	//		window.addEventListener('load', function() { get_id(); }, false);
	//	}
	//}
	//else {
//window.addEventListener('load', function() { 
//		//get_id(); 
//		var selectOpt=document.getElementsByTagName("select");
//		for(i=0;i<selectOpt.length;i++){
//			if(selectOpt[i].name=="selectStartStation")from_station=selectOpt[i];
//			if(selectOpt[i].name=="selectDestinationStation")to_station=selectOpt[i];
//		}
//		//alert(location.href);
//		//do_action(); 
//	}, false);
	//}
//}
