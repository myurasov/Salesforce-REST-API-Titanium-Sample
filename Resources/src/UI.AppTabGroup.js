/**
 * Main application window
 * @copyright 2014 Mikhail Yurasov <me@yurasov.me>
 */

var TrackPage = require('src/UI.TrackPage');
var HistoryPage = require('src/UI.HistoryPage');

module.exports.createAppTabGroup = function () {

  var view;
  var win1;
  var win2;

  view = Ti.UI.createTabGroup();

  // tab 1

  win1 = TrackPage.createTrackPage();

  view.addTab(tab1 = Ti.UI.createTab({
    title : 'Track',
    icon  : '/images/82-dog-paw.png',
    window: win1
  }));

  win1.containingTab = tab1;

  // tab 2

  win2 = HistoryPage.createHistoryPage();

  view.addTab(tab2 = Ti.UI.createTab({
    title : 'History',
    icon  : '/images/103-map.png',
    window: win2
  }));

  win2.containingTab = tab2;

  //

  return view;
};
