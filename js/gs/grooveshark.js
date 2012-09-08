(function() {
  var root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.GrooveShark = (function() {
    var key;

    GrooveShark.endpoint = 'api/query-song.php';

    key = null;

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

    return GrooveShark;

  })();

}).call(this);
