/**
 * Tracking page
 * @copyright 2014 Mikhail Yurasov <me@yurasov.me>
 */

var Auth = require('src/AuthService');

module.exports.createTrackPage = function () {

  var view;
  var switchEnableTracking;
  var positionList = [];

  createUI();
  attachEvents();

  function attachEvents() {
    switchEnableTracking.addEventListener('change', function (e) {

      if (e.value) {

        if (!Auth.get()) {
          // no authorization
          switchEnableTracking.value = 0;
          Auth.openLogin();
        } else {
          createPositionObject();
        }

      } else {
        stopGeolocation();
      }

    });
  }

  function startGeolocation() {
    Ti.Geolocation.purpose = 'Geolocation';
    Ti.Geolocation.preferredProvider = 'gps';
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
    Ti.Geolocation.addEventListener('location', onLocation);
  }

  function onLocation(e) {

    // get coordinates
    var lat = e.coords.latitude;
    var lon = e.coords.longitude;

    positionList.unshift([lat, lon]);

    // store only 25 recent positions
    if (positionList.length > 25) {
      positionList.splice(-1);
    }
    
    // save data

    var authData = Auth.get();

    var xhr = Ti.Network.createHTTPClient();

    xhr.open('PATCH', authData.instance_url + '/services/data/v29.0/sobjects/Position__c/' + Ti.App.positionObjectId);
    xhr.setRequestHeader('Authorization', authData.token_type + ' ' + authData.access_token);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify({'Data__c': JSON.stringify(positionList)}));
    
  }

  function stopGeolocation() {
    Ti.Geolocation.removeEventListener('location', onLocation)
  }

  // create positon document
  function createPositionObject() {
    
    var authData = Auth.get();  

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function (e) {
      // start gelocation
      Ti.App.positionObjectId = JSON.parse(e.source.responseText).id;
      startGeolocation();
    };

    xhr.onerror = function (e) {
      if (e.source.status === 401 /* unauthorized */) {
        switchEnableTracking.value = 0;
        Auth.openLogin();
      }
    };

    xhr.open('POST', authData.instance_url + '/services/data/v29.0/sobjects/Position__c');
    xhr.setRequestHeader('Authorization', authData.token_type + ' ' + authData.access_token);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify({'Data__c': ''}));
  }

  function createUI() {

    var row1;
    var tableView;

    view = Ti.UI.createWindow({
      title          : 'Track',
      backgroundColor: 'white',
      top            : -64,
      bottom         : -49
    });

    view.add(tableView = Ti.UI.createTableView({
      top   : 64,
      bottom: 49,
      style : Titanium.UI.iPhone.TableViewStyle.GROUPED
    }));

    tableView.appendRow(row1 = Ti.UI.createTableViewRow({
      selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE
    }));

    row1.add(Ti.UI.createLabel({
      text  : 'Enable tracking',
      left  : 10,
      height: 44
    }));

    row1.add(switchEnableTracking = Ti.UI.createSwitch({
      right: 10,
      value: false
    }));
  }

  return view;
};