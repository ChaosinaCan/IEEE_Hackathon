(function() {
  var root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.gs = new GrooveShark('67b088cec7b78a5b29a42a7124928c87');

  root.lastfm = new LastFM({
    apiKey: '6e9f1f13f07ba5bcbfb0a8951811c80e',
    apiSecret: '4db7199ede1a06b27e6fd96705ddba49'
  });

  root.lastfm.error = {
    notFound: 404,
    invalidService: 2,
    invalidMethod: 2,
    authenticationFailed: 4,
    invalidFormat: 5,
    invalidParameters: 6,
    invalidResource: 7,
    operationFailed: 8,
    invalidSessionKey: 9,
    invalidAPIKey: 10,
    serviceOffline: 11,
    invalidMethodSignature: 13,
    serverError: 16,
    suspendedKey: 26,
    rateLimitExceeded: 29
  };

  root.TrackFinder = (function() {

    TrackFinder.defaultLimit = 5;

    TrackFinder.prototype.limit = null;

    function TrackFinder(limit) {
      this.find = __bind(this.find, this);

      this.findById = __bind(this.findById, this);
      this.limit = limit != null ? limit : TrackFinder.defaultLimit;
    }

    TrackFinder.prototype.findById = function(mbid, callback) {
      var _this = this;
      return lastfm.track.getSimilar({
        mbid: mbid,
        limit: this.limit
      }, {
        success: function(data) {
          return typeof callback === "function" ? callback(_this.parseResult(data)) : void 0;
        },
        error: function(code, message) {
          return typeof callback === "function" ? callback({
            error: code,
            message: message
          }) : void 0;
        }
      });
    };

    TrackFinder.prototype.find = function(title, artist, callback) {
      var _this = this;
      return lastfm.track.getSimilar({
        track: title,
        artist: artist,
        autocorrect: 1,
        limit: this.limit
      }, {
        success: function(data) {
          return typeof callback === "function" ? callback(_this.parseResult(data)) : void 0;
        },
        error: function(code, message) {
          return typeof callback === "function" ? callback({
            error: code,
            message: message
          }) : void 0;
        }
      });
    };

    TrackFinder.prototype.parseResult = function(data) {
      if (!('@attr' in data.similartracks)) {
        return {
          error: lastfm.error.notFound,
          message: 'Song not found'
        };
      }
      return data.similartracks;
    };

    return TrackFinder;

  })();

}).call(this);
