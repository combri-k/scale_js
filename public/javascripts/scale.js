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
  return this;
};

// Main varirables
var _ = __factory__("Wildcard");

//===============
//= TYPECLASSES =
//===============

// Traversable
(function(__traversable__) {
  __traversable__.each = function(block) {
    for(i in this) if(this.hasOwnProperty(i)) block.call(this, i, this[i]);
  };

  __traversable__.size = function() {
    var size = 0;
    for(i in this) if(this.hasOwnProperty(i)) ++size;
    return size;
  };

  __traversable__.first = function() {
    return this[0];
  };

  __traversable__.last = function() {
    return this[this.size() - 1];
  };
})(__factory__("Traversable"));

// Mappable
(function(__mappable__) {
  __mappable__.get = function(key) {
    return this.__values__[key];
  };

  __mappable__.set = function(key, value) {
    this.__values__[key] = value;
    return this;
  };

  __mappable__.toObject = function() {
    // Pending
  };

  __mappable__.keys = function() {
    var keys = new Array;
    for(i in this.__values__) keys.push(i);
    return keys;
  }

  __mappable__.firstKey = function() {
    return this.keys().first();
  };

  __mappable__.values = function() {
    var values = new Array;
    for(i in values = this.__values__) values.push(values[i]);
    return values;
  }

  __mappable__.firstValue = function() {
    return this.values().first();
  }
})(__factory__("Mappable"));

// Caseable
(function(__caseable__) {
  // === will be replaced when the Eq typecass shall be created
  __caseable__.of = function(obj) {
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

  this.__values__ = new Object;
  for(i in obj) {
    if(obj[i] instanceof Map || obj[i] instanceof Object)
     this. __values__[i] = new Map(obj[i]);
    else this.__values__[i] = obj[i];
  }
  return this;
};

// Range
function Range(ary){};

// Set
function Set(ary){};

// Rational
function Rational(){};

//=============
//= DERIVINGS =
//=============

Map.deriving    (  Traversable, Mappable  );
Array.deriving  (  Traversable            );
String.deriving (  Traversable, Caseable  );
Set.deriving    (  Traversable            );
Number.deriving (  Caseable               );
