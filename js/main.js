(function() {
  var beginTree, iced, root, __iced_k, __iced_k_noop,
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

  root.lastfm.search = function(title, artist, callback) {
    var query;
    query = {
      track: title,
      limit: 10
    };
    if ((artist != null) && artist !== '') query.artist = artist;
    return lastfm.track.search(query, {
      success: function(data) {
        var i, results, tempresults, track, ___iced_passed_deferral, __iced_deferrals, __iced_k,
          _this = this;
        __iced_k = __iced_k_noop;
        ___iced_passed_deferral = iced.findDeferral(arguments);
        if (typeof data.results.trackmatches === 'object') {
          tempresults = (function() {
            var _i, _len, _ref, _results;
            _ref = data.results.trackmatches.track;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              track = _ref[_i];
              _results.push(SongData.fromLastFM(track));
            }
            return _results;
          })();
        } else {
          tempresults = [];
        }
        results = [];
        (function(__iced_k) {
          var _i, _len, _ref, _results, _while;
          _ref = tempresults;
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
              (function(__iced_k) {
                __iced_deferrals = new iced.Deferrals(__iced_k, {
                  parent: ___iced_passed_deferral,
                  funcname: "success"
                });
                track.checkGrooveShark(__iced_deferrals.defer({
                  assign_fn: (function(__slot_1, __slot_2) {
                    return function() {
                      return __slot_1[__slot_2] = arguments[0];
                    };
                  })(results, i),
                  lineno: 45
                }));
                __iced_deferrals._fulfill();
              })(_next);
            }
          };
          _while(__iced_k);
        })(function() {
          return typeof callback === "function" ? callback(results) : void 0;
        });
      },
      error: function(code, message) {
        console.log(code, message);
        return typeof callback === "function" ? callback([]) : void 0;
      }
    });
  };

  root.TrackFinder = (function() {

    TrackFinder.defaultLimit = 6;

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

  beginTree = function(songdata) {
    var doExpand, insertSongNode, rootlist;
    rootlist = $('<ul>');
    $('#tree').empty().append(rootlist);
    doExpand = function(node, li) {
      if (node._clicked != null) return;
      node._clicked = true;
      li.addClass('working');
      return node.expand(function(expanded) {
        var child, _i, _len, _ref, _results;
        li.removeClass('working');
        if (expanded.children.length === 0) {
          $(li).children('ul').append($('<li>').text('No similar songs found'));
        }
        _ref = expanded.children;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          _results.push(insertSongNode(child, $(li).children('ul')));
        }
        return _results;
      });
    };
    insertSongNode = function(node, list) {
      var item;
      item = $('<li>');
      item.append($('<a href="javascript:;">').text("" + node.song.title + " – " + node.song.artist).attr('title', node.song.mbid).click(function() {
        $(this).removeAttr('href');
        return doExpand(node, item);
      }));
      if (node.song.gs.url != null) {
        item.append($('<a class=play>').attr('href', node.song.gs.url).click(function(e) {
          gs.changeSong(node.song.gs.url);
          return e.preventDefault();
        }));
      }
      item.append($('<ul>'));
      list.append(item);
      return item;
    };
    root.rootnode = new SongNode(songdata);
    insertSongNode(rootnode, rootlist);
    return doExpand(rootnode, rootlist.children('li'));
  };

  $(function() {
    var selectResult;
    selectResult = function(track) {
      beginTree(track);
      return $('#search-results').empty();
    };
    return $('#search-submit').click(function(e) {
      var container, list, results, track, ___iced_passed_deferral, __iced_deferrals, __iced_k,
        _this = this;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      e.preventDefault();
      $(this).attr('disabled', true);
      $('#search-form').addClass('working');
      results = [];
      (function(__iced_k) {
        __iced_deferrals = new iced.Deferrals(__iced_k, {
          parent: ___iced_passed_deferral
        });
        lastfm.search($('#search-song').val(), $('#search-artist').val(), __iced_deferrals.defer({
          assign_fn: (function() {
            return function() {
              return results = arguments[0];
            };
          })(),
          lineno: 162
        }));
        __iced_deferrals._fulfill();
      })(function() {
        var _fn, _i, _len;
        container = $('#search-results').empty();
        if (results.length === 0) {
          container.append($('<p>').text('No songs found'));
        } else {
          list = $('<ul>');
          _fn = function(track) {
            return list.append($('<li>').append($('<a href="javascript:;">').text("" + track.title + " – " + track.artist).click(function() {
              return selectResult(track);
            })));
          };
          for (_i = 0, _len = results.length; _i < _len; _i++) {
            track = results[_i];
            _fn(track);
          }
          container.append(list);
        }
        $(_this).removeAttr('disabled');
        return $('#search-form').removeClass('working');
      });
    });
  });

}).call(this);
