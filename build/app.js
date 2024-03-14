var adTime = null;
window.appType = 'paid'; // paid or free
window.ads = {};
window.LN = navigator.language.substr(0, 2) ? navigator.language.substr(0, 2) : 'en';
//window.languagesList = ['ru','en','de','it','es','pt','fr','zh','ja','ko','tr'];
// Base langs
window.languagesList = ['ru', 'en'];

window.globalSettings;
var _wL = {
    "languages": {
        ru: "Русский",
        en: "English",
        de: "Deutsch",
        it: "Italiano",
        es: "Español",
        pt: "Portugués",
        fr: "Аrançais",
        zh: "中國",
        ja: "日本人",
        ko: "한국어",
        tr: "Türk"
    },
};

var Utilities = {
    isSplashScreenInstalled: function (cordovaMetadata) {
      var splashScreenNames = ['cordova-plugin-splashscreen'];
      return splashScreenNames.some(function(name) {
        return cordovaMetadata.hasOwnProperty(name);
      });
    },
    initSplashScreen: function () {
        return new Promise(function(resolve, reject) {
            if (window.cordova) {
                var cordovaMetadata = cordova.require('cordova/plugin_list').metadata; // eslint-disable-line no-undef
                if (Utilities.isSplashScreenInstalled(cordovaMetadata) === true) {
                  resolve('Find splashscreen plugin');
                }else {
                  reject('Could not find splashscreen plugin');
                }
            }else {
               reject('Cannot find cordova');
            }
        });
    },
    setLang: function () {
        window.LN = Utilities.inArray(window.LN, window.languagesList) ? LN : 'en';
        globalSettings = JSON.parse(localStorage.getItem('globalSettings'));
        if (globalSettings === null) {
            globalSettings = {
                language: window.LN,
                languageFull: _wL.languages[LN]?_wL.languages[LN]: ""
            };
        } else {
            globalSettings = {
                language: window.LN,
                languageFull: _wL.languages[LN]?_wL.languages[LN]: ""
            };
        }
        localStorage.setItem('globalSettings', JSON.stringify(globalSettings));
        window.LN = globalSettings.language;

    },
    switchLang: function (langDescription) {
        globalSettings = {
            language: langDescription,
            languageFull: _wL.languages[langDescription],
        };
        localStorage.setItem('globalSettings', JSON.stringify(globalSettings));
        window.LN = globalSettings.language;
    },
    inArray: function (what, where) {
        for (var i = 0; i < where.length; i++) {
            if (what === where[i]) return true;
        }
        return false;
    },
    updateBanner: function () {
        // console.log('~~~~~ updateBanner');
        if (adTime) {
            var now = new Date();
            if (now.getTime() > adTime.getTime() + 50 * 1000) {
                // console.log('~~~~~ updateBanner open');
                if (window.appType === 'free') {
                    Utilities.showInterstitialAdMob();
                }
                adTime = new Date();
                // console.log(adTime);
            }
        } else adTime = new Date();
    },
    initAdMob: function () {
        if (typeof AdMob !== undefined) {
            if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
                window.ads.bannerId = "ca-app-pub-3070299224692668/6232112306";
                window.ads.interstitialId = "ca-app-pub-3070299224692668/7362372906";
                // test ads
                // window.ads.bannerId = "ca-app-pub-3070299224692668/6364134637";
                // window.ads.interstitialId = "ca-app-pub-3070299224692668/7840867839";
            } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
                window.ads.bannerId = "ca-app-pub-3070299224692668/7736712731";
                window.ads.interstitialId = "ca-app-pub-3070299224692668/3907958992";
                // test ads
                // window.ads.bannerId = "ca-app-pub-3070299224692668/9876004239";
                // window.ads.interstitialId = "ca-app-pub-3070299224692668/1933935031";
            } else {

            }

        } else {
            console.log("Google AdMob Unavailable");
        }
    },
    showBannerAdMob: function () {
        try {
            if (AdMob) {
                AdMob.createBanner({
                    adId: window.ads.bannerId,
                    // isTesting: true, // TODO: remove this line when release
                    position: AdMob.AD_POSITION.BOTTOM_CENTER,
                    autoShow: true
                });
            }
        }
        catch (err) {
            console.log('AdMob banner crashed:', err)
        }

    },
    showInterstitialAdMob: function () {
        if (AdMob) {
            AdMob.prepareInterstitial({
                adId: window.ads.interstitialId,
                // isTesting: true, // TODO: remove this line when release
                autoShow: true
            });
            AdMob.showInterstitial();
        }
    },
    initGoogleAnalytics: function () {
        if (typeof analytics !== undefined) {
            if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
                window.analytics.startTrackerWithId('UA-73911508-3', 30);
            } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
                window.analytics.startTrackerWithId('UA-73911508-2', 30);
            } else {

            }

        } else {
            console.log("Google Analytics Unavailable");
        }
    },
    toObject: function (jsonData) {
        var data;
        if(typeof(jsonData) === "string") {
            data = JSON.parse(jsonData);
        } else {
            data = jsonData;
        }
        return data;
    },
    notificationOpenedCallback: function (jsonData) {
        // console.log('jsonData', jsonData.notification.payload);
        var jsonDat = Utilities.toObject(jsonData);
        if (jsonDat.hasOwnProperty("notification")) {
            var notification = Utilities.toObject(jsonDat.notification);
            if (notification.hasOwnProperty("payload")) {
                var payload = Utilities.toObject(notification.payload);
                if (payload.hasOwnProperty("additionalData")) {
                    var additionalData = Utilities.toObject(payload.additionalData);
                    // console.log('notificationOpened',payload.additionalData);
                    if (/(android)/i.test(navigator.userAgent)) { // for android & amazon-fireos
                        if(additionalData.hasOwnProperty("android")) {
                            // console.log('android',additionalData.android);
                            Utilities.openMarketApp(additionalData.android);
                        }
                    } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
                        if(additionalData.hasOwnProperty("ios")) {
                            // console.log('ios',additionalData.ios);
                            Utilities.openMarketApp(additionalData.ios);
                        }
                    } else {

                    }
                }
            }

        }

    },
    openMarketApp: function (appId) {
        cordova.plugins.market.open(appId, {
            success: function() {
                // console.log('market success');
            },
            failure: function() {
                // console.log('market failure');
            }
        });
    },
    initOneSingal: function () {
        if (window.plugins.OneSignal) {
            window.plugins.OneSignal
                //.startInit('ac80f62c-cf78-4839-9ef9-24f74f2732df') // free
                .startInit('a24717dc-24e0-449a-9f13-8f7b7900034c') // paid
                .handleNotificationOpened(Utilities.notificationOpenedCallback)
                .endInit();
            window.plugins.OneSignal.sendTag("location", window.LN);
        } else {
            console.log("Can not find variable OneSignal. Push initialization failed.");
        }
    },

};
document.addEventListener("deviceready", onAppReady, false);
function onAppReady() {
  Utilities.initSplashScreen().then(function () {
    StatusBar.hide();
  });
  Utilities.setLang();
  if (window.appType === 'free'){
      setTimeout(function(){
          Utilities.initAdMob();
          Utilities.showBannerAdMob();
          // Utilities.showInterstitialAdMob();
          Utilities.updateBanner();
      },99);
  } else {

  }
  // Utilities.initGoogleAnalytics();
  // Utilities.initOneSingal();
}
