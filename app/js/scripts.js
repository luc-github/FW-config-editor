var target_FW = "repetier";

function get_label(sline){
     if (target_FW.toLowerCase() == "smoothieware"){
        return "label";
    } else {
        var tline =  sline.split(" ");
        var tsize = tline.length;
        if (tsize >3){
            var result = "";
            for (i = 3; i < tsize ; i++){
                if (tline[i][0] == '[') break;
                result += tline[i]+" ";
            }
            return result;
            }
        else  return "???";
    }
}

function get_value(sline){
    if (target_FW.toLowerCase() == "smoothieware"){
        return "value";
    } else {
        var tline =  sline.split(" ");
        if ( tline.length >3){
              return tline[2];
        } else return "???";
    }
}

function get_help(sline){
    if (target_FW.toLowerCase() == "smoothieware"){
        return "help";
    } else {
         var tline =  sline.split("[");
         if (tline.length > 1){
            var tline2 =  tline[1].split("]");
            return tline2[0];
        } else  return "";
    }
}

function get_command(sline){
     if (target_FW.toLowerCase() == "smoothieware"){
        return "set";
    } else {
         var tline =  sline.split(" ");
        if ( tline.length >3){
            var stype = tline[0].split(":");
            var command = "M206 T" + stype[1];
             command += " P" + tline[1];
             if (stype[1] == "3") command += " X";
             else command += " S";
        return command;
        } else return "; ";
    }
}

function is_commented(sline){
    if (target_FW.toLowerCase() == "smoothieware"){
        line = sline.trim();
        return  sline.startsWith("#");
    } else {
        return false;
    }
}

function is_entry(sline){
    if (target_FW.toLowerCase() == "smoothieware"){
        if (sline.trim().length > 1)return true;
        else return false;
    } else {
        return sline.startsWith("EPR:");
    }
}

function create_entry(sentry){
    var container_block = document.getElementById("editor_table");    
    var trblock;
     var tdblock;
     if (!is_entry(sentry))return;
     trblock = document.createElement("tr");
     //comment
    tdblock = document.createElement("td");
     trblock.appendChild(tdblock);
     //check if it is a smoothieware
     if (target_FW.toLowerCase() != "smoothieware"){
          var comment = document.getElementById("comment");
          comment.style.display="none";
          tdblock.style.display="none";
     }
   
     //label
    tdblock = document.createElement("td");
    tdblock.style="width:20px";
    var t = document.createTextNode(get_label(sentry)); 
    tdblock.appendChild(t);
    trblock.appendChild(tdblock);
    container_block.appendChild(trblock);
    //value
    tdblock = document.createElement("td");
    tdblock.style="width:20px";
    var inputblock = document.createElement("input");
    if (target_FW.toLowerCase() != "smoothieware"){
        inputblock.type="number";
        inputblock.min=0;
    } else {
                inputblock.type="text";
                }
    inputblock.style="width:70px";    
    inputblock.value = get_value(sentry);
    tdblock.appendChild(inputblock);
    trblock.appendChild(tdblock);
    var buttonblock = document.createElement("button");
    t = document.createTextNode("Set");
    buttonblock.onclick = function() { 
            var value = inputblock.value;
            if ((value.trim()[0]=='-') || (value=="") || (value.toLowerCase().indexOf("e")!=-1)){
                inputblock.value=get_value(sentry);
            } else {
                alert(get_command(sentry) + value.trim()); 
            }
            
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
    var sline;
    if (target_FW.toLowerCase() == "repetier"){
        document.getElementById("target_fw").innerHTML="Repetier EEPROM editor";
        sline = "EPR:2 83 360000 Stop stepper after inactivity [ms,0=off]";
        create_entry(sline);
        sline = "EPR:0 1028 7 Language";
        create_entry(sline);
        sline = "EPR:3 1160 180.000 Temp Ext PLA:";
        create_entry(sline);
        sline = "EPR:1 239 1 Extr.1 temp. stabilize time [s]";
        create_entry(sline);}
    else if (target_FW.toLowerCase() == "smoothieware"){
         document.getElementById("target_fw").innerHTML="Smoothieware config editor";
        sline = "# Robot module configurations : general handling of movement G-codes and slicing into moves";
        create_entry(sline);
        sline = "default_feed_rate                            4000             # Default rate ( mm/minute ) for G1/G2/G3 moves";
        create_entry(sline);
        sline = "                                                              # note it is invalid for both the above be 0";
        create_entry(sline);
        sline = "##panel.contrast                               18                # override contrast setting (default is 18)";
        create_entry(sline);}
    else alert(target_FW.toLowerCase());
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
