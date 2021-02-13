/*
ABOUT
 * converts TX81Z coarse and fine values to the synth's internal frequency ratio and vice versa
 * adapted from Matt Gregory's python code: https://mgregory22.me/tx81z/freqratios.html (THANK YOU MATT)
 
 MESSAGES TO MAX JS OBJECT: 
 * getcoarsefine 5.00 (where 5.00 is a ratio between 0). returns coarse and fine values as a list
 * getratio 4 15 (where 4 is coarse, 15 is fine). returns ratio
*/

/***********************************************************************************/
// MAX/MSP CONFIGS AND FUNCTIONS

autowatch = 1; 
inlets = 1;
outlets = 1;
var debug = false;

function getcoarsefine(ratio){ //for max/msp
  var coarseFine = calcCoarseFine(ratio);
  outlet(0, coarseFine);
}

function getratio(coarse, fine) { //for max/msp
  var ratio =  calcRatio(coarse, fine);
    outlet(0, ratio);
}

/***********************************************************************************/
//ARRAYS FOR MAPPING

var group_to_coarse = [
  0,  4,  8, 10, 13, 16, 19, 22, 25, 28, 31, 34, 36, 40, 42, 45,  // group 0 // 0
  1,  5,  9, 14, 18, 23, 26, 30, 35, 39, 43, 46, 49, 52, 55, 58,  // group 1 // 16
  2,  6, 11, 15, 20, 24, 29, 33, 38, 44, 48, 50, 53, 56, 59, 61,  // group 2 // 32
  3,  7, 12, 17, 21, 27, 32, 37, 41, 47, 51, 54, 57, 60, 62, 63,  // group 3 // 48
]
var coeffs = [
  [ 0.50,  0.0625   ],                                          // group 0
  [ 0.71,  0.088105 ],   // 0.50 + 0.21,  0.0625 + 0.025605     // group 1
  [ 0.78,  0.098145 ],   // 0.71 + 0.07,  0.088105 + 0.01004    // group 2
  [ 0.87,  0.108105 ],   // 0.78 + 0.09,  0.098145 + 0.00996    // group 3
]

/***********************************************************************************/
// CALCULATION FUNCTIONS

function calcRatio(_crs, _fin) {
  var coarse_index, group, order, ratio;
  var finerange = 15;
  var skip = 8;
  
  //validation, clamping, etc
  if(typeof(_crs) !== 'number' || typeof(_fin) !== 'number') {
    post("error. there must be both a coarse and a fine value, and they must both be numbers."+"\n")
  } else {
    var coarse = Math.min(Math.max(_crs, 0), 63);
    if (coarse < 4) {
      finerange = 7;
      skip = 0;
    }
    var fine = Math.min(Math.max(_fin, 0), finerange);
      
      // determine ratio
      coarse_index = group_to_coarse.indexOf(coarse);
      group = Math.floor(coarse_index / 16);
      order = (coarse_index % 16) * 16 - skip + fine;
      ratio = coeffs[group][0] + coeffs[group][1] * order;
  
      return Math.floor(ratio * 100) / 100
  }
}


function calcCoarseFine (_rat) {
  var coarse, coarse_index, fine, group, order;
  
  //validation, rounding and clamping
  if(typeof(_rat) !== 'number') {
    post("error. ratio must be a number"+"\n")
  } else {
    var ratio = Math.min(Math.max(_rat, 0.5), 27.57);

    // determine group and order
    var min = 1000;
    if(debug) post("ratio: "+ratio+"\n");
    for (var i = 0; i < coeffs.length; i++) {
      var inc = coeffs[i][1];
      var base = coeffs[i][0];
      var ord = (ratio - base) / inc;
      var _rem = (ratio - base) % inc;
      if(_rem < 0.5 * inc) inc = 0;
      var rem = Math.abs(inc - _rem);
      if(debug) post("rem: "+Math.floor(rem*10000)/10000+" | group: "+i+" | order: "+ord+"\n");
      if (ord < 0 || ord > 247) rem = 1001;
      if (rem < min) {
        min = rem;
        group = i;
        order = Math.round(ord);
      }
    }

    if(debug) post("min: "+min+" | group: "+group+" | order: "+order+"\n"); 
    // calculate coarse and fine using group + order
    if(order < 8) {
      fine = order % 8;
      coarse_index = group * 16;
    } else {
      fine = (order-8) % 16;
      coarse_index = (group * 16) + Math.floor((order - 8) / 16) + 1;
    };
    coarse = group_to_coarse[coarse_index];
    if(debug) post("ratio: "+ratio+" | group: "+group+" | order: "+order+" | coarse_index: "+coarse_index+" | coarse: "+coarse+" | fine: "+fine+"\n");
    
    return [parseInt(coarse), parseInt(fine)];
  }
}