/**
 * Application bootstrapping
 * @copyright 2014 Mikhail Yurasov <me@yurasov.me>
 */

var AppTabGroup = require('src/UI.AppTabGroup');
var Auth = require('src/AuthService');

// open main window
AppTabGroup.createAppTabGroup().open();

// handle custom url scheme
Ti.App.addEventListener('resumed', function (e) {
  args = Ti.App.getArguments();

  if (args && args.url) {

    var url = args.url;
    var path = url.match('://(.*?)[\\?#]')[1];

    if (path == 'oauth-callback') {

      // get hash part
      var query = url.substr(url.indexOf('#') + 1);

      var data = {};

      // split into parts
      var parts = query.split('&');

      // read names and values
      for (var i = 0; i < parts.length; i++) {
        var name = parts[i].substr(0, parts[i].indexOf('='));
        var val = parts[i].substr(parts[i].indexOf('=') + 1);
        val = decodeURIComponent(val);
        data[name] = val;
      }

      // save auth data
      Auth.set(data);
    }
  }
});
