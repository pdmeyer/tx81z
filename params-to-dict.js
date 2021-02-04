var p = this.patcher;
var d = "tx-params";
if (jsarguments.length>1)
	d = jsarguments[1]; // allow the name of the dict to be set as using argument of the js object in Max
var dict = new Dict(d);

//create "Attack Rate" 0 0 31 VCED op
function filldict() {
  var a = arrayfromargs(arguments);
  dict.replace(a[0]+"::id",a[1]);
  dict.replace(a[0]+"::min",a[2]);
  dict.replace(a[0]+"::max",a[3]);
  dict.replace(a[0]+"::subgroup",a[4]);
  dict.replace(a[0]+"::type",a[5]);
}