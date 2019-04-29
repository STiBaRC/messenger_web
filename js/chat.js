var first = true;

function getAllUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
            paramName = paramName;
            paramValue = paramValue;
            if (obj[paramName]) {
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                if (typeof paramNum === 'undefined') {
                    obj[paramName].push(paramValue);
                }
                else {
                    obj[paramName][paramNum] = paramValue;
                }
            }
            else {
                obj[paramName] = paramValue;
            }
        }
    }
    return obj;
}

var toBox = function(oof,i) {
	try {
		var div = document.createElement('div');
		div.className = 'chatbox'
		div.setAttribute("name", i);
		var orig = oof.message;
		try {
			if (oof.message.startsWith("[Encrypted] ")) {
				if (localStorage.enckeys == undefined) {
					localStorage.enckeys = JSON.stringify({});
				}
				var enckeys = JSON.parse(localStorage.enckeys);
				if (enckeys[getAllUrlParams().id] != undefined && enckeys[getAllUrlParams().id].trim() != "") {
					try {
						oof.message = CryptoJS.AES.decrypt(oof.message.substring(12,oof.message.length), enckeys[getAllUrlParams().id]).toString(CryptoJS.enc.Utf8).replace(/</g, "&lt;").replace(/>/g, "&gt;");
					} catch(err) {
						oof.message = "<b style=\"color:green;\"><i>[Message encrypted, enter your encryption key to view]</i></b>";
					}
				} else {
					oof.message = "<b style=\"color:green;\"><i>[Message encrypted, enter your encryption key to view]</i></b>";
				}
			}
		} catch(err) {
			console.log(err);
			oof.message = orig;
		}
		orig = oof.message;
		try {
			if (oof.message.startsWith("data:") && oof.message.length > 5 && !(oof.message.includes("\n"))) {
				var mime = oof.message.substring(5,oof.message.length).split(",")[0];
				var type = mime.split("/")[0];
				if (type == "image") {
					oof.message = '<img src="'+oof.message+'" style="max-width: 85vw; max-height: 85vh;"></img>';
				} else if (type == "video") {
					oof.message = '<video style="max-width: 85vw; max-height: 85vh;" controls><source src="'+oof.message+'"></video>';
				} else if (type == "audio") {
					oof.message = '<audio controls><source src="'+oof.message+'"></audio>';
				} else {
					oof.message = '<a href="'+oof.message+'" target="_blank"><b><i>View attachment</i></b></a>';
				}
			}
		} catch(err) {
			oof.message = orig;
		}
		div.innerHTML = '<a href="https://stibarc.gq/user.html?id='+oof['sender']+'">'+oof['sender']+'</a><br/>'+oof['message'].replace(/\n/g, "<br/>");
		document.getElementById("chatstuffs").appendChild(div);
		document.getElementById("chatstuffs").innerHTML = document.getElementById("chatstuffs").innerHTML.concat("<br/>");
	} catch(err) {console.log(err);}
}

var oldresponse = "";
var inloop = false;
var firsti = 0;

var loadmoreloop = function(tmp, i) {
	toBoxMore(tmp[i-1], i-1);
	var tmp2 = firsti-20;
	if (tmp2 < 0) {tmp2=0;}
	if (tmp[i-1] != undefined && i >= tmp2) {
		try{document.getElementsByName(firsti)[0].scrollIntoView();}catch(err){}
		setTimeout(function() {loadmoreloop(tmp, i-1)},1);
	} else {
		firsti = i-1;
		inloop = false;
	}
}

var toBoxMore = function(oof, i) {
	try {
		var div = document.createElement('div');
		div.className = 'chatbox'
		div.setAttribute("name", i);
		var orig = oof.message;
		try {
			if (oof.message.startsWith("[Encrypted] ")) {
				if (localStorage.enckeys == undefined) {
					localStorage.enckeys = JSON.stringify({});
				}
				var enckeys = JSON.parse(localStorage.enckeys);
				if (enckeys[getAllUrlParams().id] != undefined && enckeys[getAllUrlParams().id].trim() != "") {
					try {
						oof.message = CryptoJS.AES.decrypt(oof.message.substring(12,oof.message.length), enckeys[getAllUrlParams().id]).toString(CryptoJS.enc.Utf8).replace(/</g, "&lt;").replace(/>/g, "&gt;");
					} catch(err) {
						oof.message = "<b style=\"color:green;\"><i>[Message encrypted, enter your encryption key to view]</i></b>";
					}
				} else {
					oof.message = "<b style=\"color:green;\"><i>[Message encrypted, enter your encryption key to view]</i></b>";
				}
			}
		} catch(err) {
			console.log(err);
			oof.message = orig;
		}
		orig = oof.message;
		try {
			if (oof.message.startsWith("data:") && !(oof.message.includes("\n"))) {
				var mime = oof.message.substring(5,oof.message.length).split(",")[0];
				var type = mime.split("/")[0];
				if (type == "image") {
					oof.message = '<img src="'+oof.message+'" style="max-width: 85vw; max-height: 85vh;"></img>';
				} else if (type == "video") {
					oof.message = '<video style="max-width: 85vw; max-height: 85vh;" controls><source src="'+oof.message+'"></video>';
				} else if (type == "audio") {
					oof.message = '<audio controls><source src="'+oof.message+'"></audio>';
				} else {
					oof.message = '<a href="'+oof.message+'" target="_blank"><b><i>View attachment</i></b></a>';
				}
			}
		} catch(err) {
			oof.message = orig;
		}
		div.innerHTML = '<a href="https://stibarc.gq/user.html?id='+oof['sender']+'">'+oof['sender']+'</a><br/>'+oof['message'];
		document.getElementById("chatstuffs").innerHTML = '<br/><div class="chatbox" name="'+(i)+'">'+'<a href="https://stibarc.gq/user.html?id='+oof['sender']+'">'+oof['sender']+'</a><br/>'+oof['message'].replace(/\n/g, "<br/>")+'</div>'+document.getElementById("chatstuffs").innerHTML;
	} catch(err) {console.log(err);}
}

var getchatsloop = function(tmp, i) {
	toBox(tmp[i],i);
	window.scrollTo(0,document.body.scrollHeight);
	if (tmp[i+1] != undefined) {
		setTimeout(function() {getchatsloop(tmp, i+1)},1);
	} else {
		inloop = false;
	}
}

var getchats = function(id, sess) {
	var http = new XMLHttpRequest();
	http.open("POST", "https://messenger.stibarc.gq/api/v2/getuserchat.sjs", true);
	http.send("id="+id+"&sess="+sess);
	http.onload = function(e) {
		if (http.responseText != oldresponse && !inloop) {
			try {
				var tmp = JSON.parse(http.responseText);
				oldresponse = http.responseText;
				if (first) {
					first = false;
					inloop = true;
					document.getElementById("chatstuffs").innerHTML = document.getElementById("chatstuffs").innerHTML.concat("<br/>");
					var tmpi = Object.keys(tmp).length-20;
					if (tmpi < 0) {tmpi = 0;}
					firsti = tmpi;
					getchatsloop(tmp, tmpi);
				} else {
					toBox(tmp[Object.keys(tmp).length-1],Object.keys(tmp).length-1);
					window.scrollTo(0,document.body.scrollHeight);
				}
			} catch(err) {console.log(err);}
		}
		setTimeout(function(){getchats(id, sess);}, 500);
	}
}

var sendtext = function(sess,username,id) {
	var text = document.getElementById("input").value;
	document.getElementById("input").value = "";
	var tmp = text.split("\n");
	if (tmp[tmp.length-1] == "") {
		tmp.pop();
	}
	text = tmp.join("\n");
	if (text != "" && text != undefined) {
		if (localStorage.enckeys == undefined) {
			localStorage.enckeys = JSON.stringify({});
		}
		var enckeys = JSON.parse(localStorage.enckeys);
		if (enckeys[id] != undefined) {
			if (enckeys[id].trim() != "") {
				text = "[Encrypted] "+CryptoJS.AES.encrypt(text, enckeys[id]).toString();
			}
		}
		var chathttp2 = new XMLHttpRequest();
		chathttp2.open("POST", "https://messenger.stibarc.gq/api/postchat.sjs", true);
		chathttp2.send("sess="+sess+"&other="+username+"&id="+id+"&message="+encodeURIComponent(text));
	}
}

window.onload = function() {
	first = true;
	var id = getAllUrlParams().id;
	var sess = window.localStorage.getItem("sess");
	var chathttp = new XMLHttpRequest();
	chathttp.open("POST", "https://messenger.stibarc.gq/api/v2/getuserchats.sjs", true);
	chathttp.send("sess="+sess);
	chathttp.onload = function(e) {
		var tmp = JSON.parse(chathttp.responseText);
		var username = tmp[id]['user'];
		document.getElementById("user").innerHTML = "<b>"+username+"</b>";
		document.getElementById("send").onclick = function(e) {
			sendtext(sess,username,id);
		}
		document.getElementById("attach").onclick = function(e) {
			document.getElementById("secretfileupload").click();
		}
		document.getElementById("secretfileupload").addEventListener('change',function(evt) {
			var f = evt.target.files[0];
			if (f) {
				var r = new FileReader();
				r.onload = function(e) {
					var contents = e.target.result;
					var enckeys = JSON.parse(localStorage.enckeys);
					if (enckeys[id] != undefined) {
						if (enckeys[id].trim() != "") {
							contents = "[Encrypted] "+CryptoJS.AES.encrypt(contents, enckeys[id]).toString();
						}
					}
					var chathttp2 = new XMLHttpRequest();
					chathttp2.open("POST", "https://messenger.stibarc.gq/api/postchat.sjs", true);
					chathttp2.send("sess="+sess+"&other="+username+"&id="+id+"&message="+encodeURIComponent(contents));
					document.getElementById("secretfileupload").value = "";
				}
				r.readAsDataURL(f);
			}
		});
		document.getElementById("setenc").onclick = function(e) {
			var enckeys = JSON.parse(localStorage.enckeys);
			if (enckeys[id] == undefined) {
				var key = prompt("Encryption key? (Must be shared with other user ahead of time)");
				enckeys[id] = key;
				delete key;
			} else {
				delete enckeys[id];
			}
			localStorage.enckeys = JSON.stringify(enckeys);
			delete enckeys;
			location.reload();
		}
		var shifted = false;
		document.getElementById("input").addEventListener("keydown", function(e) {
			if (e.keyCode == 16) {
				shifted = true;
			}
		});
		document.getElementById("input").addEventListener("keyup", function(e) {
			if (e.keyCode == 13 && shifted == false) {
				sendtext(sess,username,id);
			}
			if (e.keyCode == 16) {
				shifted = false;
			}
		});
		getchats(id, sess);
		startNotifs();
	}
}

window.onscroll = function(e) {
	try {
		if (window.pageYOffset == 0 && !inloop) {
			if (firsti > 0) {
				inloop = true;
				var tmp = JSON.parse(oldresponse);
				loadmoreloop(tmp, firsti);
			}
		}
	} catch(err) {console.log(err);}
}