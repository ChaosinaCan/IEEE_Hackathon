(function() {
  var root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.GrooveShark = (function() {
    var key;

    GrooveShark.endpoint = 'api/query-song.php';

    key = null;

    GrooveShark.prototype.window = null;

    function GrooveShark(apikey) {
      this.search = __bind(this.search, this);
      key = apikey;
    }

    GrooveShark.prototype.query = function(query, callback, errback) {
      var url;
      url = encodeURI(GrooveShark.endpoint + ("?query=" + query));
      return $.getJSON(url).then(callback, errback);
    };

    GrooveShark.prototype.search = function(title, artist, callback, errback) {
      return this.query("" + artist + " " + title, callback, errback);
    };

    GrooveShark.prototype.open = function() {
      this.window = window.open('http://grooveshark.com');
      this.window.blur();
      return window.focus();
    };

    GrooveShark.prototype.changeSong = function(url) {
      if (this.window != null) {
        return this.window.location.assign(url);
      } else {
        return this.window = window.open(url);
      }
    };

    return GrooveShark;

  })();

}).call(this);
