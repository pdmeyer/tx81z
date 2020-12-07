inlets = 1;
outlets = 0;
autowatch = 1;

var p = this.patcher;
var d = "patch";
if (jsarguments.length>1)
	d = jsarguments[1]; // allow the name of the dict to be set as using argument of the js object in Max
var patch = new Dict(d);
var vcedops = [];
var acedops = [];

/*-------------------------------------------------------------------------------------------------------------*/

var opOrder = [4,2,3,1]; //there is a bug in the tx81z's firmware which dumps the operators in this weird order
var vcedOpParams = ["AR", "D1R", "D2R", "RR", "D1L", "LS", "RS", "EGS", "AME", "KVS", "OUT", "Freq", "DET"];
var vcedParams = ["ALG", "Feeback", "LFOSpeed", "LFODelay", "PModDepth", "AModDepth", "LFOSync", "LFOWave", "PModSens", "AMS", "Transpose", "PolyMode", "PBendRange", "PortaMode", "PortaTime", "FCVolume", "Sustain", "Portamento", "Chorus", "MWPitch", "MWAmplitude", "BCPitch", "BCAmplitude", "BCPitchBias", "BCEGBias"
]
var acedOpParams = ["FixedFreq", "FixedFreqRange", "FreqRangeFine", "OSW"];
var acedParams = ["ReverbRate", "FCPitch", "FCAmplitude"];

/*-------------------------------------------------------------------------------------------------------------*/

/*
vced = params that the tx81z shares with other yamaha fm synths
use decimal number format
remove the header (240 67 5 3 0 93) and the end flag (247) first
*/
function vced() {
  var a = arrayfromargs(arguments);
  
  // get vced operator data
  for (var i = 0; i < 4; i++) { //the first 52 bytes are 4 groups of 13. each group represents 1 operator
    var start = i * 13;
    vcedops[i] = a.slice(start,start+13); //stores the 52 bytes as 4 arrays
  }
  
  // store vced operator data
  for (var j = 0; j < vcedops.length; j++){
    for(var k = 0; k < vcedOpParams.length; k++){
      patch.replace("vced::ops::"+opOrder[j]+"::"+vcedOpParams[k], vcedops[j][k]); //populate the dict 
    }
  }

  // get vced voice data (voice data = params that affect the whole patch, not just one operator)
  vpstart = vcedOpParams.length*4;
  vcedpars = a.slice(vpstart,vpstart+vcedParams.length);

  // store vced voice data
  for (var m = 0; m < vcedParams.length; m++) {
    patch.replace("vced::voice::"+vcedParams[m], vcedpars[m]);
  }
}

/*-------------------------------------------------------------------------------------------------------------*/

/*
aced = params that are unique to tx81z
use decimal number format
remove the header (240 67 5 126 0 33 76 77 32 32 56 57 55 54 65 69) and the end flag (247) first
*/
function aced() { //
  var a = arrayfromargs(arguments);
  
  // get aced operator data
  for(var i = 0; i < 4; i++){
    var start = i * 5;
    acedops[i] = a.slice(start,start+5);
  }
  
  // store aced oparator data
  for(var j = 0; j < acedops.length; j++) {
    for (var k = 0; k < acedOpParams.length; k++) {
      patch.replace("aced::ops::"+opOrder[j]+"::"+acedOpParams[k], acedops[j][k]);
    }
  }
  
  // get aced voice data
  apstart = acedOpParams.length*4;
  acedpars = a.slice(apstart,apstart+acedParams.length);

  // store aced voice data
  for(var m = 0; m < acedParams.length; m++) {
    patch.replace("aced::voice::"+acedParams[m], acedpars[m]);
  }
}

/*-------------------------------------------------------------------------------------------------------------*/

// erases the dict's contents
function cleardict() {
  patch.clear();
}
