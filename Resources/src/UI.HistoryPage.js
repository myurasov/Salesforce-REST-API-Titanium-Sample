/**
 * History page
 * @copyright 2014 Mikhail Yurasov <me@yurasov.me>
 */

var Auth = require('src/AuthService');

module.exports.createHistoryPage = function () {

  var view;
  var tableView;
  var intervalId;

  createUI();
  attachEvents();

  function update() {
    if (Ti.App.positionObjectId) {

      var authData = Auth.get();

      var xhr = Ti.Network.createHTTPClient();1

      xhr.onload = function (e) {

        var data = JSON.parse(e.source.responseText).Data__c;
        data = JSON.parse(data);

        if (data) {

          for (var i = 0; i < data.length; i++) {
            data[i] = {
              title: data[i][0] + ', ' + data[i][1]
            }
          }

          // display data
          tableView.setData(data);
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

  function createUI() {

    var row1;

    view = Ti.UI.createWindow({
      title          : 'History',
      backgroundColor: 'white',
      top            : -64,
      bottom         : -49
    });

    view.add(tableView = Ti.UI.createTableView({
      top   : 64,
      bottom: 49,
      style : Titanium.UI.iPhone.TableViewStyle.GROUPED
    }));

  }

  return view;
};