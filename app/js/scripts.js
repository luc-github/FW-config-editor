function get_label(sline){
    return "label";
}

function get_value(sline){
    return "value";
}

function get_help(sline){
    return "help";
}

function get_command(sline){
    return "set ";
}

function create_entry(sentry){
    var container_block = document.getElementById("editor_table");
    //entry
    var trblock = document.createElement("tr");
    var tdblock = document.createElement("td");
    tdblock.style="width:20px";
    var t = document.createTextNode(get_label(sentry)); 
    tdblock.appendChild(t);
    trblock.appendChild(tdblock);
    container_block.appendChild(trblock);
    //value
    tdblock = document.createElement("td");
    tdblock.style="width:20px";
    var inputblock = document.createElement("input");
    inputblock.type="text";
    inputblock.style="width:70px";    
    inputblock.value = get_value(sentry);
    tdblock.appendChild(inputblock);
    trblock.appendChild(tdblock);
    var buttonblock = document.createElement("button");
    t = document.createTextNode("Set");
    buttonblock.onclick = function() { 
            alert(get_command(sentry) + inputblock.value); 
        };
    buttonblock.appendChild(t);
    tdblock.appendChild(buttonblock);
    //help
    tdblock = document.createElement("td");
    tdblock.style="width:20px";
    t = document.createTextNode(get_help(sentry)); 
    tdblock.appendChild(t);
    trblock.appendChild(tdblock);
}

window.onload = function() {
    var sline = "EPR:2 83 360000 Stop stepper after inactivity [ms,0=off]";
    create_entry(sline);
    sline = "EPR:0 1028 7 Language";
    create_entry(sline);
    sline = "EPR:3 1160 180.000 Temp Ext PLA:";
    create_entry(sline);
    sline = "EPR:1 239 1 Extr.1 temp. stabilize time [s]";
    create_entry(sline);
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
