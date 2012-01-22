// Hash class, can be instantiated these ways:
  // new Hash(myHash) ~> js way
  // Hash.new(myHash) ~> ruby way
  // H(myHash)        ~> lazy way

// TODO:
// Array        ~> some
// String       ~> some
// Number       ~> some
// Enumerable   ~> some
// TryStatement ~> create a TryStatement class, the result allows: tryTo(block).or(block) (does not seem legit)
// Add block handling in try methods
// Add method instanceEval and its alias ie
// Solve the "RY" problem (i.e. __send__ declared three times)

// DEFINES
var ALIAS_AND_BIND_REGEXP = /#|\./;

function Hash(obj) {
  if(!(obj instanceof Object)) throw "Argument must be an instance of Object.";
  var that = this;
  for(i in obj) {
    that[i] = obj[i];
    if(obj[i] != null && obj[i].constructor == Object)
      that[i] = new Hash(obj[i]);
  }
}; H = Hash.new = function(obj) { return new Hash(obj); };

// "Main" new methods:
(function(__main__) {
  __main__.call = function(obj, method) {
    var args = toA(arguments).slice(2);
    return method.functionalize(obj.constructor.prototype).apply(obj, args);
  };

  __main__.callAttribute = function(obj, attribute) {
    return obj[attribute];
  };

  __main__.alias = function(toAlias, alias) {
    var meth; var proto; toAlias.split(ALIAS_AND_BIND_REGEXP).tap(function(ary) {
      proto = ary.first().functionalize().prototype;
      meth  = ary.second().functionalize(proto);
    }); if(proto[alias] = meth) return true; else return false;
  };

  __main__.bind = function(toBind, block) {
    var proto; var meth; toBind.split(ALIAS_AND_BIND_REGEXP).tap(function(ary) {
      proto = ary.first().functionalize().prototype;
      meth  = ary.last();
    }); if(proto[meth] = block) return true; else return false;
  };

  __main__.toA = function(args) {
    return Array.prototype.slice.call(args);
  };
})(parent);

// Hash new methods:
(function(__hash__) {
  __hash__.clear = function() {
    for(i in this)
      if(this.hasOwnProperty(i))
        delete this[i];
    return this;
  };

  __hash__.remove = function(key) {
    var remove;
    if(this.hasOwnProperty(key)) {
      remove = this[key];
      delete this[key];
    }
    return remove;
  };

  __hash__.reject   =
  __hash__.removeIf = function(block) {
    var removeIf;
    for(i in this)
      if(this.hasOwnProperty(i))
        if(block.call(this, i, this[i])) {
          removeIf = this[i];
          delete this[i];
        }
    return removeIf;
  };

  // Other idea: add eql? to all types and call it (if eql? does not exist call == and console.log or sth)
  __hash__.eql = function(obj) {
    if(!(obj instanceof Hash)) return false;
    return this.toString() === obj.toString();
  };

  // __hash__.hash = function() {
  //   return this.inject(new Array, function(ary,v,k) {
  //     ary.push(k.toString(), (v instanceof Hash) ? v.hash() : v.toString()); return ary;
  //   }).join("");
  // };

  // WIP: test all type of objects and create an eql method in each for this method to work properly.
  // __hash__.eqlOLD = function(obj) {
  //   // Will be removed when Array.prototype.eql and Function.prototype.eql will be created.
  //   console.log(
  //     "Notice eql(): this method is absolutely NOT viable:\
  //     if values are instances of Array or Function it ALWAYS return false for the moment."
  //   );

  //   // Comparing Hash with sth different.
  //   if(!(obj instanceof Hash)) return false;

  //   var that = this;
  //   for(i in that) {
  //     if(obj[i] != undefined) {
  //       // If the value of Hash's key is a Hash too so we call eql method recursively.

  //       // Another thing to notice: this condition will be overloaded like this:
  //       // if(foo instanceof Hash || foo instanceof Array || foo instanceof Function)...
  //       if(that[i] instanceof Hash)
  //         if(!that[i].eql(obj[i]))
  //           return false;
  //       // The equality here does NOT work for Array or Function, it's normal.
  //       // By creating an eql method in both class we could use that method instead of !==
  //       if(that[i] !== obj[i]){
  //         return false;
  //       }
  //     // Keys does not match? Objects are unequal.
  //     } else return false;
  //   } return true;
  // };

  __hash__.replace = function(hsh) {
    if(!(hsh instanceof Hash)) return false;

    this.clear();
    for(i in hsh)
      if(hsh.hasOwnProperty(i))
        this[i] = hsh[i];
    return this;
  };

  __hash__.merge = function(hsh) {
    if(!(hsh instanceof Hash)) return false;

    var merge = new Hash;
    for(i in hsh)
      if(hsh.hasOwnProperty(i))
        merge[i] = hsh[i];
    for(i in this)
      if(!merge.hasOwnProperty(i) && this.hasOwnProperty(i))
        merge[i] = this[i];
    return merge;
  };

  __hash__.update = function(hsh) {
    if(!(hsh instanceof Hash)) return false;

    var update = new Hash;
    for(i in hsh)
      if(hsh.hasOwnProperty(i))
        update[i] = hsh[i];
    for(i in this)
      if(!update.hasOwnProperty(i) && this.hasOwnProperty(i))
        update[i] = this[i];

    this.replace(update);
    return this;
  };

  __hash__.empty = function() {
    return this.length() === 0;
  };

  __hash__.rassoc = function(value) {
    var rassoc = this.inject(new Array, function(ary,v,k) {
      if(v === value || (value instanceof Hash && value.eql(v)))
        ary.push(k,v); return ary;
    });
    return rassoc.empty() ? null : rassoc;
  };

  __hash__.keepIf = function(block) {
    this.replace(this.inject(new Hash, function(hsh,v,k) {
      if(block.call(this,v,k) === true) {
        var tmp = {}; tmp[k] = v;
        hsh.update(H(tmp));
      } return hsh;
    }));
    return this;
  };

  __hash__.select = function(block) {
    return this.inject(new Hash, function(hsh,v,k) {
      if(block.call(this,v,k) === true) {
        var tmp = {}; tmp[k] = v;
        hsh.update(H(tmp));
      } return hsh;
    });
  };

  __hash__.shift = function() {
    var shift = new Hash;
    for(i in this)
      if(this.hasOwnProperty(i)) {
        shift[i] = this[i];
        delete this[i];
        return shift.flatten();
      }
    return null;
  };

  __hash__.toA = function() {
    return this.map(function(v,k) {
      return [k, v];
    });
  };

  __hash__.valuesAt = function() {
    var that = this;
    return Array.prototype.slice.call(arguments).map(function(v) {
      if(that.hasOwnProperty(v)) return that[v];
    }).compact();
  };

  // Level /!\
  __hash__.flatten = function(level) {
    //(level || 1).times(function(i) { ... });
    return this.inject(new Array, function(ary,v,k) {
      ary.push(k,v); return ary;
    });
  };

  __hash__.toLocaleString    =
  __hash__.inspect           =
  __hash__.toS               =
  __hash__.toString          = function() {
    return this.inject(new Array, function(ary,v,k) {
      ary.push(k + ": " + ((v instanceof Hash) ? v.inspect() : v)); return ary;
    }).join(", ").encapsulate("{ ", " }");
  };
})(Hash.prototype);

// Array new methods:
(function(__array__) {
  __array__.second = function() {
    return this[1];
  };

  __array__.empty = function() {
    return this.length === 0
  };

  __array__.uniq = function() {
    var uniq = new Array;
    this.inject(new Hash, function(hsh, v) {
      hsh[v] = v; return hsh;
    }).map(function(v, k) { uniq.push(v); });
    return uniq;
  };

  __array__.intersect = function(ary) {
    var intersect = new Array;
    this.each(function(v1) {
      ary.each(function(v2) {
        if(v1 == v2 || (v1 instanceof Hash && v1.eql(v2)))
          intersect.push(v1);
        return intersect;
      });
    });
    return intersect.uniq();
  };

  __array__.sum = function() {
    var sum = new Number;
    for(i in this)
      if(this.hasOwnProperty(i))
        sum += parseFloat(this[i]);
    return sum;
  };

  __array__.each = function(block) {
    for(i in this)
      if(this.hasOwnProperty(i))
        block.call(this, this[i], i);
  };

  __array__.map = function(block) {
    var map = new Array;
    for(i in this)
      if(this.hasOwnProperty(i))
        map.push(block.call(this, this[i], i));
    return map;
  };

  __array__.inject = function(obj, block) {
    var inject;
    for(i in this)
      if(this.hasOwnProperty(i))
        inject = block.call(this, obj, this[i], i);
    return inject;
  };

  __array__.clear = function() {
    this.each(function(v,k) {
      this.splice(0, this.length);
    });
    return this;
  };

  __array__.replace = function(ary) {
    if(!(ary instanceof Array)) return false;
    this.clear();
    for(i in ary)
      if(ary.hasOwnProperty(i))
        this.splice(i, 1, ary[i]);
    return this;
  };

  __array__.removeAt = function(index) {
    var removeAt = this[index];
    this.splice(index, 1);
    return removeAt;
  };

  __array__.compact = function() {
    compact = new Array;
    this.each(function(v) {
      if(v != null && v != undefined) compact.push(v);
    }); return compact;
  };

  __array__.compactThis = function() {
    compact = new Array;
    this.each(function(v) {
      if(v != null && v != undefined) compact.push(v);
    }); return this.replace(compact);
  };

  __array__.include = function(value) {
    var include = this.inject(new Hash, function(hsh,v,k) {
      hsh[v] = v; return hsh;
    });
    return include.include(value);
  };

  __array__.sample = function() {
    return this[Math.rand(this.length - 1)];
  };

  // In progress
  __array__.flatten = function(level) {
    // return this;
  };

  __array__.toLocaleString =
  __array__.toS            =
  __array__.toString       = function() {
    return this.join(", ").encapsulate("[ ", " ]")
  };
})(Array.prototype);

// NodeList new methods:
(function(__node_list__) {
  __node_list__.first = function() {
    return this[0];
  };

  __node_list__.last = function() {
    return this[this.length - 1];
  };

  __node_list__.at = function(index) {
    return this[index];
  };

  __node_list__.uniq = function() {
    var uniq = new NodeList;
    this.inject(new Hash, function(hsh, v) {
      hsh[v] = v; return hsh;
    }).map(function(v, k) { uniq.push(v); });
    return uniq;
  };

  __node_list__.intersect = function(ary) {
    var intersect = new NodeList;
    this.each(function(v1) {
      ary.each(function(v2) {
        if(v1 == v2) intersect.push(v1);
        return intersect;
      });
    });
    return intersect.uniq();
  };

  __node_list__.sum = function() {
    var sum = new Number;
    for(i in this)
      if(this.hasOwnProperty(i))
        sum += parseFloat(this[i]);
    return sum;
  };

  __node_list__.each = function(block) {
    for(i in this)
      if(this.hasOwnProperty(i))
        block.call(this, this[i], i);
  };

  __node_list__.map = function(block) {
    var map = new NodeList;
    for(i in this)
      if(this.hasOwnProperty(i))
        map.push(block.call(this, this[i], i));
    return map;
  };

  __node_list__.inject = function(obj, block) {
    var inject;
    for(i in this)
      if(this.hasOwnProperty(i))
        inject = block.call(this, obj, this[i], i);
    return inject;
  };
})(NodeList.prototype);

// String new methods:
(function(__string__) {
  __string__.encapsulate = function(beg, end) {
    var beg = beg || "", end = end || beg;
    return beg + this + end;
  };

  __string__.replaceAt = function(i, newValue) {
    return this.substr(0, i-1) + newValue + this.substr(i);
  };

  __string__.empty = function() {
    return this.length === 0;
  };

  __string__.strip = function() {
    return this.replace(/^\s*/, '').replace(/\s*$/, '');
  };

  __string__.concat = function(str) {
    return this + str
  };

  __string__.toI = function() {
    return parseInt(this);
  };

  __string__.toF = function() {
    return parseFloat(this);
  };

  __string__.toS = function() {
    return this.toString();
  };

  __string__.as_id = function() {
    return "#" + this;
  };

  __string__.as_class = function() {
    return "." + this;
  };

  __string__.functionalize = function(context) {
    if(context)
      return context[this.toS()];
    else return parent[this.toS()];
  };
})(String.prototype);

// Number new methods:
(function(__number__) {
  __number__.toI = function() {
    return parseInt(this.valueOf());
  };

  __number__.toF = function() {
    return parseFloat(this.valueOf());
  };

  __number__.time  =
  __number__.times = function(block) {
    for(var i = 0; i < this.toI(); ++i)
      block.call(this, i);
  };

  __number__.second  =
  __number__.seconds = function() {
    return this.toI();
  };

  __number__.minute  =
  __number__.minutes = function() {
    return this.toI() * 60..seconds();
  };

  __number__.hour  =
  __number__.hours = function() {
    return this.toI() * 60..minutes();
  };

  __number__.day  =
  __number__.days = function() {
    return this.toI() * 24..hours();
  };

  __number__.week  =
  __number__.weeks = function() {
    return this.toI() * 7..days();
  };

})(Number.prototype);

// Math new method:
(function(__math__) {
  __math__.rand = function(max) {
    return Math.round(Math.random() * max)
  };
})(Math);
