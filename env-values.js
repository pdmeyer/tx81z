inlets = 1;
outlets = 2; //0 to tx, 1 to mc.function
autowatch = 1;

var numEnvs;
var envs = new Dict("envelopes");

//number of operator envelopes in use is specified with [js] argument
if (jsarguments.length > 1) {
  numEnvs = jsarguments[1];
} else {
  numEnvs = 4;
}
var params = ["Attack Rate", "Decay 1 Rate", "Decay 2 Rate", "Release Rate", "Decay 1 Level"];

// 0. 0. AR 127. D1R D1L D2R 64 RR 0 
// 0  1  2  3    4   5   6   7  8  9
function env() {
  var inl = arrayfromargs(arguments);
  var rel = {};
  var abs = {};

  //"n" = new dump from tx | "e" = editing with mc.function 
  // if "n", don't output to tx
   var mode = inl.splice(0,1); 

  //iterate through envelopes
  for(var h = 0; h < numEnvs; h++) {
    var g = h*10;
    var f = h+1;

    //relative values for tx81z
    rel.ar = clamp(inl[2+g], 0, 127);
    rel.d1r = clamp(inl[4+g]-inl[2+g], 0, 127);
    rel.d1l = clamp(inl[5+g], 0, 127);
    rel.d2r = clamp(inl[6+g]-inl[4+g], 0, 127);
    rel.rr = clamp(inl[8+g]-inl[6+g], 0, 127);
    var tx_out = [rel.ar, rel.d1r, rel.d2r, rel.rr, rel.d1l];
    
    //absolute values for mc.function
    abs.ar = rel.ar;
    abs.d1r = rel.ar + rel.d1r;
    abs.d1l = rel.d1l;
    abs.d2r = rel.ar + rel.d1r + rel.d2r;
    abs.rr = rel.ar + rel.d1r + rel.d2r + rel.rr;
    
    //output to tx81z. iterate through params
    for(var i = 0; i < params.length; i++) {
      var key  = "op "+f+"::"+params[i];
      
      //if param doesn't exist in dict, add it
      if(!envs.contains(key)) {
        envs.replace(key, 0);
      };
      
      //check if new value matches the one in the dict
      //if not, update the dict and output the value
      var t = Math.floor(tx_out[i]);
      if(envs.get(key) !== t) {
        envs.replace(key, t)
        var msg = ["op", f, params[i], t];
        if(mode === "e") outlet(0, msg) //don't output if processing new patch dump
      };
    };

    //output to mc.function
    var func_out = ["set", 0, 0, abs.ar, 127, abs.d1r, abs.d1l, abs.d2r, abs.d1l*0.75, abs.rr, 0];
    outlet(1, ["target", f]);
    outlet(1, func_out);
  }
}

function clamp(val, min, max) {
  return Math.min(max,Math.max(min,val));
}