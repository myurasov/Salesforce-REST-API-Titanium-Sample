/**
 * History page
 * @copyright 2014 Mikhail Yurasov <me@yurasov.me>
 */

var Auth = require('src/AuthService');
var MapModule = require('ti.map');

module.exports.createHistoryPage = function () {

  var view;
  var intervalId;
  var map;
  var route;

  createUI();
  attachEvents();

  function update() {
    if (Ti.App.positionObjectId) {

      var authData = Auth.get();

      var xhr = Ti.Network.createHTTPClient();

      xhr.onload = function (e) {

        var data = JSON.parse(e.source.responseText).Data__c;
        data = JSON.parse(data);

        // detect map region
        if (data) {

          var minLat = null, minLon = null, maxLat = null, maxLon = null;

          for (var i = 0; i < data.length; i++) {
            var lat = data[i][0];
            var lon = data[i][1];

            minLat = lat < minLat || minLat === null ? lat : minLat;
            minLon = lon < minLon || minLon === null ? lon : minLon;
            maxLat = lat > maxLat || maxLat === null ? lat : maxLat;
            maxLon = lon > maxLon || maxLon === null ? lon : maxLon;
          }

          var mapLat = (minLat + maxLat) / 2;
          var mapLatDelta = (maxLat - minLat) / 2;

          var mapLon = (minLon + maxLon) / 2;
          var mapLonDelta = (maxLon - minLon) / 2;

          map.setRegion({
            latitude: mapLat,
            longitude: mapLon,
            latitudeDelta: mapLatDelta,
            longitudeDelta: mapLonDelta
          });

          // create route

          var points = [];

          for (var i = 0; i < data.length; i++) {
            points.push({
              latitude: data[i][0],
              longitude: data[i][1]
            });
          }

          if (route) {
            map.removeRoute(route)
          };

          route = MapModule.createRoute({
            width : 4,
            color : '#1ec7fe',
            points: points
          });

          map.addRoute(route);
        }
      }

      // get position list
      xhr.open('GET', authData.instance_url + '/services/data/v29.0/sobjects/Position__c/' + Ti.App.positionObjectId);
      xhr.setRequestHeader('Authorization', authData.token_type + ' ' + authData.access_token);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send();
    }
  }

  function attachEvents() {

    view.addEventListener('focus', function () {
      update();
      intervalId = setInterval(update, 1000);
    })

    view.addEventListener('blur', function () {
      if (intervalId) {
        clearInterval(intervalId);
      }
    })
  }

  return view;

  function createUI() {

    var row1;

    view = Ti.UI.createWindow({
      title          : 'History',
      backgroundColor: 'white',
      top            : -64,
      bottom         : -49
    });


    // create map

    map = MapModule.createView({
      mapType     : MapModule.NORMAL_TYPE,
      top         : 64,
      bottom      : 49,
      userLocation: true,
      animate     : true
    });

    view.add(map);

  }
}
;
