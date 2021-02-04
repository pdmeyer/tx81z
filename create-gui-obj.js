autowatch = 1;
inlets = 1;
outlets = 0;

var p = this.patcher; 
var initcomment = p.getnamed("init-comment");
var objs = [];
var xpos = 2.5;
var ypos = 27.;
var objParams = {
  "textbutton" : {
    "xoffs": 42.,
    "nam" : "textbutton",
    "pW" : 40.,
    "pH" : 20.,
    "args" : ["@textoncolor", 1, 1, 1, "@mode", 1, "@text", "off", "@texton" ,"on"]
  },
  "dial" : {
    "xoffs" : 42.,
    "nam" : "dial",
    "pW" : 40.,
    "pH" : 40.,
    "args" : ["@min", 0., "@size", 127.]
  },
};

//createObjects dial 0 6
function createObjects(ob, param, min, max) {
  // remove previously-created objects
  if(initcomment) {
    p.remove(initcomment)
  }
  if(objs.length > 0) {
    objs.forEach( function(o) {
      p.remove(o);
    })
  }

  var comment = p.newdefault(xpos, ypos - 20, "comment", "@presentation", 1, "@presentation_rect", 2.5, 5., 150., 20.);
  comment.set(param);
  var send = p.newdefault(xpos, ypos + 110, "s", "to-tx");  
  objs.push(comment);
  objs.push(send);

  // set arguments depending on object type
  var d;
  var scaleargs;
  if(ob == "dial") {
    d = objParams.dial;
    d.args[1] = min;
    d.args[3] = max+1;
    scaleargs = [min, max, 0, 127];
  } else if (ob == "textbutton") {
    d = objParams.textbutton;
    scaleargs = [0,1,0,127];
  }
  
  //create and connect objects
  
  for(var i = 0; i < 4; i++) {
    var x = xpos + d.xoffs * i;
    var px = 2.5 + d.xoffs * i;
    var scale = p.newdefault(x, ypos + 50, "scale", scaleargs)
    objs.push(scale);
    var prepend = p.newdefault(x, ypos + 80, "prepend", "op", i+1, param);
    objs.push(prepend);
    var varname = param+"_"+i;
    objs.push(scale);
    var obj = p.newdefault(x, ypos, d.nam, 
      "@presentation", 1, "@presentation_rect", px, 27., d.pW, d.pH, "@varname", varname, d.args);
    objs.push(obj);
    p.connect(obj,0,scale,0);
    p.connect(scale,0,prepend,0);
    p.connect(prepend,0,send,0);
  }
}



