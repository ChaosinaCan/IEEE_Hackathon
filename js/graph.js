(function() {
  var iced, root, __iced_k, __iced_k_noop,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  iced = {
    Deferrals: (function() {

      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) return this.continuation(this.ret);
      };

      _Class.prototype.defer = function(defer_params) {
        var _this = this;
        ++this.count;
        return function() {
          var inner_params, _ref;
          inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          if (defer_params != null) {
            if ((_ref = defer_params.assign_fn) != null) {
              _ref.apply(null, inner_params);
            }
          }
          return _this._fulfill();
        };
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    }
  };
  __iced_k = __iced_k_noop = function() {};

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.SongData = (function() {

    SongData.prototype.mbid = null;

    SongData.prototype.title = null;

    SongData.prototype.artist = null;

    SongData.prototype.album = null;

    SongData.prototype.gs = {
      found: false,
      url: null,
      id: null
    };

    SongData.prototype.loaded = false;

    SongData.prototype.error = false;

    function SongData(title, artist) {
      this.getSimilar = __bind(this.getSimilar, this);

      this.checkGrooveShark = __bind(this.checkGrooveShark, this);
      this.title = title;
      this.artist = artist;
      this.album = null;
    }

    SongData.prototype.checkGrooveShark = function(callback) {
      var _this = this;
      return gs.search(this.title, this.artist, function(data) {
        _this.loaded = true;
        if (data != null) {
          _this.gs.found = true;
          _this.gs.url = data.Url;
          _this.gs.id = data.SongID;
          _this.album = data.AlbumName;
        } else {
          _this.gs.found = false;
        }
        return typeof callback === "function" ? callback(_this) : void 0;
      }, function(err) {
        _this.loaded = true;
        _this.error = true;
        return typeof callback === "function" ? callback(_this) : void 0;
      });
    };

    SongData.prototype.getSimilar = function(callback) {
      var f;
      f = new TrackFinder;
      return f.find(this.title, this.artist, function(data) {
        var i, item, items, track, ___iced_passed_deferral, __iced_deferrals, __iced_k,
          _this = this;
        __iced_k = __iced_k_noop;
        ___iced_passed_deferral = iced.findDeferral(arguments);
        if ('error' in data) {
          console.log(data);
          return [];
        }
        items = [];
        (function(__iced_k) {
          var _i, _len, _ref, _results, _while;
          _ref = data.track;
          _len = _ref.length;
          i = 0;
          _results = [];
          _while = function(__iced_k) {
            var _break, _continue, _next;
            _break = function() {
              return __iced_k(_results);
            };
            _continue = function() {
              ++i;
              return _while(__iced_k);
            };
            _next = function(__iced_next_arg) {
              _results.push(__iced_next_arg);
              return _continue();
            };
            if (!(i < _len)) {
              return _break();
            } else {
              track = _ref[i];
              item = new SongData(track.name, track.artist.name);
              item.mbid = track.mbid;
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral
                });
                item.checkGrooveShark(__iced_deferrals.defer({
                  assign_fn: (function(__slot_1, __slot_2) {
                    return function() {
                      return __slot_1[__slot_2] = arguments[0];
                    };
                  })(items, i),
                  lineno: 53
                }));
                __iced_deferrals._fulfill();
              })(_next);
            }
          };
          _while(__iced_k);
        })(function() {
          items = items.filter(function(s) {
            return s.gs.found;
          });
          return typeof callback === "function" ? callback(items) : void 0;
        });
      });
    };

    return SongData;

  })();

  root.SongNode = (function() {

    SongNode.prototype.parent = null;

    SongNode.prototype.song = null;

    SongNode.prototype.similar = [];

    function SongNode(songdata, parent) {
      this.expand = __bind(this.expand, this);
      this.song = songdata;
      this.parent = parent != null ? parent : null;
    }

    SongNode.prototype.expand = function(callback) {
      var item, items, self, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      items = [];
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral,
          funcname: "SongNode.expand"
        });
        _this.song.getSimilar(__iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return items = arguments[0];
            };
          })(),
          lineno: 68
        }));
        __iced_deferrals._fulfill();
      })(function() {
        _this.similar = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            _results.push(new SongNode(item, this));
          }
          return _results;
        }).call(_this);
        if (_this.parent != null) {
          console.log('filtering');
          self = _this;
          _this.similar = _this.similar.filter(function(item) {
            return item.song.mbid !== self.parent.song.mbid;
          });
        }
        return typeof callback === "function" ? callback(_this) : void 0;
      });
    };

    return SongNode;

  })();

}).call(this);
