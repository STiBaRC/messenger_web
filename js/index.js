var checkSess = function() {
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("get", "https://api.stibarc.gq/checksess.sjs?sess="+sess, false);
	xmlHttp.send(null);
	if (xmlHttp.responseText.split("\n")[0] == "bad") {
		window.localStorage.removeItem("sess");
		window.localStorage.removeItem("username");
		location.reload();
	}
}

var getUsername = function() {
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://api.stibarc.gq/getusername.sjs", false);
	xmlHttp.send("sess="+sess);
	window.localStorage.setItem("username", xmlHttp.responseText.split("\n")[0]);
}

var getChats = function() {
	document.getElementById("mainblobwithlist").innerHTML = "<br/>";
	var sess = window.localStorage.getItem("sess");
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "https://messenger.stibarc.gq/api/v2/getuserchats.sjs", true);
	xmlHttp.send("sess="+sess);
	xmlHttp.onload = function(e) {
		var tmp = JSON.parse(xmlHttp.responseText);
		for (key in tmp) {
			var div = document.createElement('div');
			div.className = 'chatbox';
			div.innerHTML = '<a href="chat.html?id='+key+'">'+tmp[key]['user']+"</a>:";
			if (tmp[key]['lastmessage'] == undefined) {tmp[key]['lastmessage'] = {sender: tmp[key]['user'], message: "No messages sent yet"}}
			if (tmp[key]['lastmessage']['message'].length > 50) {tmp[key]['lastmessage']['message'] = tmp[key]['lastmessage']['message'].substring(0,50).concat("...");}
			div.innerHTML = div.innerHTML.concat("<br/><i>"+tmp[key]['lastmessage']['sender']+":"+tmp[key]['lastmessage']['message']+"</i>");
			document.getElementById("mainblobwithlist").appendChild(div);
			document.getElementById("mainblobwithlist").innerHTML = document.getElementById("mainblobwithlist").innerHTML.concat("<br/>");
		}
	}
}

var popuped = false;

window.onload = function() {
	document.getElementById("loginbutton").onclick = function(evt) {
		if (!popuped) {
			var loginpopup = window.open("https://stibarc.gq/login/", "", "menubar=no,location=no,resizable=no,scrollbars=yes,status=yes,height=360,width=500");
			window.addEventListener("message", function(evt) {
  				if (evt.data != "Cancelled") {
					localStorage.sess = evt.data;
					getUsername();
					loginpopup.close();
					location.reload();
				} else {
					loginpopup.close();
				}
			});
		}
	}
	var sess = window.localStorage.getItem("sess");
	if (sess == undefined || sess == null || sess == "") {
		document.getElementById("loggedoutcontainer").style.display = "";
		document.getElementById("loggedincontainer").style.display = "none";
		document.getElementsByTagName("footer")[0].style.display = "none";
	} else {
		checkSess();
		getChats();
		startNotifs();
	}
	if (window.localStorage.getItem("username") == "" || window.localStorage.getItem("username") == undefined) {
		if (sess != undefined && sess != null && sess != "") {
			getUsername();
		}
	}
}