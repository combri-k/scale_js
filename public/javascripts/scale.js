//==================
//= MAIN FUNCTIONS =
//==================

// Meta functions
var __factory__ = function(f) {
  var factory = parent[f] = function() {};
  factory.__name__ = f;
  factory.toString = factory.toLocaleString = function() { return "function() { [scale.js code] }" };
  return parent[f].prototype;
};

var __to_array__ = function(args) {
  return Array.prototype.slice.call(args);
};

// Main functions
Function.prototype.deriving = function() {
  this.prototype.__derivings__ = new Array;
  for(i in arguments) {
    this.prototype.__derivings__.push(proto = arguments[i].prototype);
    for(j in proto) this.prototype[j] = proto[j];
  }
  return this;
};

// Main variables
var _ = new (function() { this.toString = this.toLocaleString = function() { return "_" } });

//===============
//= TYPECLASSES =
//===============

// Scalable
(function(__scalable__) {
  __scalable__.__send__ = function() {
    var args = __to_array__(arguments);
    return this.constructor.prototype[args[0]].apply(this, args.slice(1));
  };

  __scalable__.__try__ = function() {
    try {
      var args = __to_array__(arguments);
      return this.constructor.prototype[args[0]].apply(this, args.slice(1));
    } catch(err) { return null; }
  };

  __scalable__.asIn = function(block) {
    block.call(this, this);
    return this;
  };

  __scalable__.isNot = function() {
    // Pending
  };

  __scalable__.is = function() {
    for(i in arguments) for(j in derivings = this.__derivings__)
      if(arguments[i].prototype.constructor.__name__ === derivings[j].constructor.__name__) return true;
    return false;
  };

  __scalable__.core = function() {
    if(this.__object__ !== undefined) return this.__object__;
    var core = new Object;
    for(i in this) if(this.hasOwnProperty(i)) core[i] = this[i];
    return core;
  };
})(__factory__("Scalable"));

// Traversable
(function(__traversable__) {
  __traversable__.each = function(block) {
    var core = this.core();
    for(i in core) block.call(this, i, core[i]);
  };

  __traversable__.map = function(block) {
    var map  = new Array;
    var core = this.core();
    for(i in core) map.push(block.call(this, i, core[i]));
    return map;
  };

  __traversable__.inject = function(obj, block) {
    var inject;
    var core = this.core();
    for(i in core) inject = block.call(this, obj, i, core[i]);
    return inject;
  };

  __traversable__.size = function() {
    var size = 0;
    var core = this.core();
    for(i in core) ++size;
    return size;
  };

  __traversable__.first = function() {
    var core = this.core();
    for(i in core) return core[i];
  };

  __traversable__.last = function() {
    var core = this.core(), l;
    for(i in core) l = core[i];
    return l;
  };

  __traversable__.at = function(index) {
    return this.core()[index];
  };
})(__factory__("Traversable"));

// Mappable
(function(__mappable__) {
  __mappable__.get = function(key, handler) {
    if(this.core().hasOwnProperty(key)) return this.core()[key];

    if(handler instanceof Function)
      return handler.call(this, key, this.core());
    else return handler;
  };

  __mappable__.set = function(key, value) {
    this.core()[key] = value;
    return this;
  };

  __mappable__.eachKey = function(block) {
    this.keys().each(function(k,v) { block.call(this, v) });
  };

  __mappable__.eachValue = function(block) {
    this.values().each(function(k,v) { block.call(this, v) });
  };

  __mappable__.keys = function() {
    var keys = new Array;
    for(i in this.core()) keys.push(i);
    return keys;
  }

  __mappable__.firstKey = function() {
    return this.keys().first();
  };

  __mappable__.values = function() {
    var values = new Array;
    for(i in core = this.core()) values.push(core[i]);
    return values;
  }

  __mappable__.firstValue = function() {
    return this.values().first();
  }

  __mappable__.hasKey = function(key) {
    return this.core().hasOwnProperty(key);
  };

  __mappable__.hasValue = function(value) {
    return this.values().includes(value);
  };

})(__factory__("Mappable"));

// Caseable
(function(__caseable__) {
  // == will be replaced when the Comparable typecass shall be created
  __caseable__.of = function(obj) {
    var obj = obj.core !== undefined ? obj.core() : obj;
    for(i in obj)
      if(obj.hasOwnProperty(i) && (i == "_" || i.wildcard || i == this)) return obj[i];
    return false;
  };
})(__factory__("Caseable"));

//===========
//= CLASSES =
//===========

// Map
var Map = function(obj) {
  this.__object__ = new Object;
  for(i in obj) {
    if(obj[i] instanceof Map || obj[i] instanceof Object)
      this.__object__[i] = new Map(obj[i]);
    else this.__object__[i] = obj[i];
  }
};

// Range
var Range = function(from, to) {
  this.from = from;
  this.to   = to;
};

// Set
var Set = function(ary) {};

// Rational
var Rational = function(a,b) {};

// Array
(function(__array__) {
  __array__.includes = function(obj) {
    for(i in this) if(this.hasOwnProperty(i) && this[i] === obj) return true;
    return false;
  };

  __array__.flatten = function() {
    // Pending;
  };
})(Array.prototype);

//=============
//= DERIVINGS =
//=============

Map.deriving    (  Scalable, Traversable, Mappable  );
Array.deriving  (  Scalable, Traversable, Caseable  );
String.deriving (  Scalable, Traversable, Caseable  );
Set.deriving    (  Scalable, Traversable, Caseable  );
Number.deriving (  Scalable, Caseable               );
