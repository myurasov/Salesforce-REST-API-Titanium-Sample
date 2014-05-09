/**
 * Authentication service
 * @copyright 2014 Mikhail Yurasov <me@yurasov.me>
 */

module.exports = {

  get: function () {
    return Ti.App.Properties.getObject('auth');
  },

  set: function (data) {
    Ti.App.Properties.setObject('auth', data);
  },

  erase: function () {
    Ti.App.Properties.removeProperty('auth');
  },

  openLogin: function () {
    Ti.Platform.openURL('https://login.salesforce.com/services/oauth2/authorize' +
      '?response_type=token&display=touch' +
      '&redirect_uri=sfsampleapp://oauth-callback' +
      '&client_id=' + Ti.App.Properties.getString('salesforce_client_id'));
  }

}
