inlets = 1;
outlets = 1;
autowatch = 1;

var ranges = {
  "255" : {
    "min" : 8,
    "max" : 255,
    "crs" : 16,
    // "crs" : [8, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240],
    "fin" : 1,
  }, 
  "510" : {
    "min" : 16,
    "max" : 510,
    "crs" : 32,
    // "crs" : [16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480],
    "fin" : 2,
  },
  "1K" : {
    "min" : 32,
    "max" : 1020,
    "crs" : 64,
    // "crs" : [32, 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704, 768, 832, 896, 960],
    "fin" : 4,
  },
  "2K" : {
    "min" : 64,
    "max" : 2040,
    "crs" : 128,
    "fin" : 8,
  },
  "4K" : {
    "min" : 128,
    "max" : 4080,
    "crs" : 256,
    "fin" : 16,
  },
  "8K" : {
    "min" : 256,
    "max" : 8160,
    "crs" : 512,
    "fin" : 32,
  },
  "16K" : {
    "min" : 512,
    "max" : 16320,
    "crs" : 1024,
    "fin" : 64,
  },
  "32K" : {
    "min" : 1024,
    "max" : 32640,
    "crs" : 2048,
    "fin" : 128,
  },
}

function freq(f) {
  if(f < 8 || f > 32640) {
    post("error. fixed frequncy value must between 8 and 32640");
  } else {
    var ran;
    var range;
    var count = 0;
    for(var i in ranges) {
      var r = ranges[i];
      if (f < r.max) {
        post(f+" "+r.max+"\n");
        range = i;
        ran = r;
        break;
      }
      count++
    }
    
    var crsSteps = [];
    crsSteps.push(ran.min);
    crsSteps.push(ran.min + ran.crs / 2);
    for (var i = 1; i < 16; i++) {
      crsSteps.push(crsSteps[1] + i * ran.crs)
    }
    // post(crsSteps+"\n");
    // var min = 2049;
    var coars;
    for (var j = 0; j < crsSteps.length; j++) {
      var d = crsSteps[j] - f;
      if(d >= 0) {
        // min = d;
        coars = j-1;
        break;
      }
    }
    var fine = Math.floor((f - crsSteps[coars]) / ran.fin);
    outlet(0, "sys", count, coars, fine);
    // post("range = "+count+" coarse = "+coars+" fine = "+fine+"\n");
  }
}

function crsfine(rng, coars, fine) {
  var c = 0;
  var ran;
  var cFreq;
  var freq;
  for(var i in ranges) {
    var r = ranges[i];
    if (rng === c) {
      ran = r;
      break;
    }
    c++
  }
  post(ran.min+"\n");
  if (coars < 2) {
    cFreq = ran.min + (coars * (ran.crs/2))
  } else {
    coars = coars - 1;
    cFreq = ran.min + ran.crs/2 + (coars * ran.crs);
  }
  freq = cFreq + fine * ran.fin;
  outlet(0, "freq", freq);
  // post(freq+"\n");
}

