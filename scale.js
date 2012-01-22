var deriving = function() {
  for(i in func = Array.prototype.slice.call(arguments).slice(1))
    for(j in proto = func[i].prototype)
      arguments[0].prototype[j] = proto[j];
};

var __factory__ = function(f) {
  return parent[f] = function(){};
};

var __pfactory__ = function(f) {
  return __factory__(f).prototype;
};

(function(t) {
  t.each = function(block) {
    for(i in this) if(this.hasOwnProperty(i)) block.call(this, i, this[i]);
  };
})(__pfactory__("Traversable"));

(function(m) {
  m.keys = function() {
    keys = new Array;
    for(i in this) if(this.hasOwnProperty(i)) keys.push(i);
    return keys;
  }

  m.values = function() {
    values = new Array;
    for(i in this) if(this.hasOwnProperty(i)) values.push(this[i]);
    return values;
  }
})(__pfactory__("Mappable"));

function Map(obj) {
  for(i in obj) {
    if(obj[i] instanceof Map || obj[i] instanceof Object)
      this[i] = new Map(obj[i]);
    else this[i] = obj[i];
  }
}

deriving(Map, Traversable, Mappable);
