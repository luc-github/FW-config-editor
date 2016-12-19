window.onload = function() {
};

function Sendcommand(commandtxt, showresult){
 showresult = typeof showresult  === 'undefined' ? false: b;
var xmlhttp = new XMLHttpRequest();
var url = "/command?plain="+encodeURIComponent(commandtxt);
if (!showresult)url = "/command_silent?plain="+encodeURIComponent(commandtxt);
if (showresult){
    xmlhttp.onreadystatechange = function() {
     if (xmlhttp.readyState == 4 && xmlhttp.status === 200) {
      var textarea = document.getElementById("logwindow");
      textarea.innerHTML =  textarea.innerHTML + xmlhttp.responseText;
      textarea.scrollTop = textarea.scrollHeight;
     } 
    };
}
xmlhttp.open("GET", url, true);
xmlhttp.send();
}

function delay(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
}
