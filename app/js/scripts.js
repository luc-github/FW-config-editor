var target_FW = "smoothieware";

function get_label(sline){
    var tline =  sline.trim().split(" ");
    var tsize = tline.length;
     if (target_FW.toLowerCase() == "smoothieware"){
          return tline[0];
    } else {
        if (tsize >3){
            var result = "";
            var i = 0;
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
    var tline =  sline.split(" ");
    if (target_FW.toLowerCase() == "smoothieware"){
        if ((tline.length >1) && tline[0][0]!='#') return tline[1];
          else return "???";
    } else {
        
        if ( tline.length >3){
              return tline[2];
        } else return "???";
    }
}

function get_help(sline){
    if (target_FW.toLowerCase() == "smoothieware"){
        var pos = sline.indexOf("#");
        if (pos > -1) return sline.slice(pos+1,-1);
        else return "";
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
        return  sline.trim().startsWith("#");
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
    console.log("Processing" + sentry);
    var container_block = document.getElementById("editor_table");    
    var trblock;
    var tdblock;
    var iscomment ;
    while( sentry.indexOf("  ") > -1){ 
        var ssentry;
        ssentry = sentry.replace("  "," ");
        sentry = ssentry;
    }
    while( sentry.indexOf("##") > -1){ 
        var ssentry;
        ssentry = sentry.replace("##","#");
        sentry = ssentry;
    }
    iscomment= is_commented(sentry);
    if (!is_entry(sentry))return;
     trblock = document.createElement("tr");
     //comment
    tdblock = document.createElement("td");
    trblock.appendChild(tdblock);
    container_block.appendChild(trblock);
     if (iscomment){
         tdblock = document.createElement("td");
         trblock.appendChild(tdblock);
         console.log("is comment:" + sentry);
         t = document.createTextNode(sentry.trim()); 
         tdblock.appendChild(t);
         tdblock.colSpan="3";
         tdblock.className ="info";
     }
     else{
         //check if it is a smoothieware
         if (target_FW.toLowerCase() != "smoothieware"){
              var comment = document.getElementById("comment");
              comment.style.display="none";
              tdblock.style.display="none";
         }
       
         //label
        tdblock = document.createElement("td");
        var t = document.createTextNode(get_label(sentry)); 
        tdblock.appendChild(t);
        trblock.appendChild(tdblock);
        //value
        tdblock = document.createElement("td");
        
        var divrowblock = document.createElement("div");
        divrowblock.className ="row";
        var divcolblock = document.createElement("div");
        divcolblock.className ="col-lg-6";
        var divgroupblock = document.createElement("div");
        divgroupblock.className ="input-group";
        var spanblock = document.createElement("span");
        spanblock.className ="input-group-btn";
        
        var inputblock = document.createElement("input");
        inputblock.className ="form-control";
        inputblock.style="width:auto";
        if (target_FW.toLowerCase() != "smoothieware"){
            inputblock.type="number";
            inputblock.min=0;
        } else {
                    inputblock.type="text";
                    }
        inputblock.value = get_value(sentry);
        var buttonblock = document.createElement("button");
        buttonblock.className ="btn btn-default";
        buttonblock.type ="button";
        t = document.createTextNode("Set");
        buttonblock.onclick = function() { 
                var value = inputblock.value;
                if ((value.trim()[0] == '-') || ( value.length === 0) || (value.toLowerCase().indexOf("e")!=-1)){
                    inputblock.value=get_value(sentry);
                } else {
                    var cmd = get_command(sentry) + value.trim();
                    console.log(cmd);
                    Sendcommand(cmd); 
                }
                
            };
        buttonblock.appendChild(t);
        spanblock.appendChild(buttonblock);
        divgroupblock.appendChild(inputblock);
        divgroupblock.appendChild(spanblock);
        divcolblock.appendChild(divgroupblock);
        divrowblock.appendChild(divcolblock);
        tdblock.appendChild(divrowblock);
        trblock.appendChild(tdblock);
        //help
        tdblock = document.createElement("td");
        t = document.createTextNode(get_help(sentry)); 
        tdblock.appendChild(t);
        trblock.appendChild(tdblock);
    }
}

window.onload = function() {
    var sline;
    if (target_FW.toLowerCase() == "repetier"){
        document.getElementById("target_fw").innerHTML="Repetier EEPROM editor";
          //check if need comment
          var comment = document.getElementById("comment");
          comment.style.display="none";
      /*  sline = "EPR:2 83 360000 Stop stepper after inactivity [ms,0=off]";
        create_entry(sline);
        sline = "EPR:0 1028 7 Language";
        create_entry(sline);
        sline = "EPR:3 1160 180.000 Temp Ext PLA:";
        create_entry(sline);
        sline = "EPR:1 239 1 Extr.1 temp. stabilize time [s]";
        create_entry(sline);
        */}
    else if (target_FW.toLowerCase() == "smoothieware"){
         document.getElementById("target_fw").innerHTML="Smoothieware config editor";
        sline = "# Robot module configurations : general handling of movement G-codes and slicing into moves";
        create_entry(sline);
        sline = "default_feed_rate                            4000             # Default rate ( mm/minute ) for G1/G2/G3 moves";
        create_entry(sline);
        sline = "                                                              # note it is invalid for both the above be 0";
        create_entry(sline);
        sline = "##panel.contrast                               18                # override contrast setting (default is 18)";
        create_entry(sline);
        sline = "default_feed_rate";
        create_entry(sline);
         sline = "";
        create_entry(sline);
        }
    else alert(target_FW.toLowerCase());
};

function Refresh(){
    var commandtxt = "";
     if (target_FW.toLowerCase() == "repetier"){
         commandtxt = "M205";
     }
     else if (target_FW.toLowerCase() == "smoothieware"){
         commandtxt = "cat /sd/config.txt";
     }
     var container_block = document.getElementById("editor_table"); 
     container_block.innerHTML="";
    var xmlhttp = new XMLHttpRequest();
    var url = "/command?plain="+encodeURIComponent(commandtxt);
    xmlhttp.onreadystatechange = function() {
     if (xmlhttp.readyState == 4 && xmlhttp.status === 200) {
         console.log("got it, ");
         var txt = xmlhttp.responseText;
         var tlines = txt.split("\n");
         console.log("got " +  tlines.length + " lines\n" );
         console.log(xmlhttp.responseText);
         var i = 0;
         for (i = 0; i < tlines.length ; i++) {
            console.log("line " + i);
            create_entry(tlines[i]);
        }
        
     } 
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

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
