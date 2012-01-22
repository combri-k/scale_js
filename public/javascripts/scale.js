// must allow this:
// require("core")
// require("typeclasses")

//==================
//= MAIN FUNCTIONS =
//==================

// Meta functions
var __factory__ = function(f) {
  return (parent[f] = function(){}).prototype;
};

var __meta__ = function(obj) {
  return obj["constructor"];
};

// Main functions
Function.prototype.deriving = function() {
  for(i in arguments)
    for(j in proto = arguments[i].prototype)
      this.prototype[j] = proto[j];
};

// Main varirables
var _ = __factory__("Wildcard");

//===============
//= TYPECLASSES =
//===============

// Traversable
(function(t) {
  t.each = function(block) {
    for(i in this) if(this.hasOwnProperty(i)) block.call(this, i, this[i]);
  };

  t.size = function() {
    var size = 0;
    for(i in this) if(this.hasOwnProperty(i)) ++size;
    return size;
  };

  t.first = function() {
    return this[0];
  };

  t.last = function() {
    return this[this.size() - 1];
  };
})(__factory__("Traversable"));

// Mappable
(function(m) {
  m.keys = function() {
    var keys = new Array;
    for(i in this) if(this.hasOwnProperty(i)) keys.push(i);
    return keys;
  }

  m.firstKey = function() {
    return this.keys().first();
  };

  m.values = function() {
    var values = new Array;
    for(i in this) if(this.hasOwnProperty(i)) values.push(this[i]);
    return values;
  }

  m.firstValue = function() {
    return this.values().first();
  }
})(__factory__("Mappable"));

// Caseable
(function(c) {
  // === will be replaced when the Eq typecass shall be created
  c.of = function(obj) {
    for(i in obj)
      if(obj.hasOwnProperty(i) && (i == "_" || i == this)) return obj[i];
    return false;
  };
})(__factory__("Caseable"));

//===========
//= CLASSES =
//===========

// Map
function Map(obj) {
  if(arguments.length != 0 && !(obj instanceof Object) && !(obj instanceof Map))
    throw "Argument must be a Map or an Object";

  for(i in obj) {
    if(obj[i] instanceof Map || obj[i] instanceof Object)
      this[i] = new Map(obj[i]);
    else this[i] = obj[i];
  }
};

// Set
function Set(ary){};

// Derivings
Map.deriving    (  Traversable, Mappable  );
Array.deriving  (  Traversable            );
String.deriving (  Traversable, Caseable  );
Set.deriving    (  Traversable            );
Number.deriving (  Caseable               );
