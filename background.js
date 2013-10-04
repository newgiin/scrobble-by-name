var SETTINGS = {
    api_key: 'dd5b94d477d2c3c2cbc51362f12680b8',
    api_secret: 'c8feadce3ebbf6a0aefd5dfa3ae3cf42',
    callback_file: 'auth_callback.html'
}

var lastfm_api = new LastFM(SETTINGS.api_key, SETTINGS.api_secret);

lastfm_api.session.key = localStorage['session_key'] || '';
lastfm_api.session.name = localStorage['session_name'] || '';

function get_lastfm_session(token) {
    lastfm_api.authorize(token, function(response) {
        // Save session
        if (!response.error) {
            localStorage["session_key"] = response.session.key;
            localStorage["session_name"] = response.session.name;
        } else {
            console.log('Last.fm authorization failed: ' + response.error)
        }
    });
}

function clear_session() {
    lastfm_api.session = {};
    localStorage.removeItem('session_key');
    localStorage.removeItem('session_name');
}

function scrobble(artist, track, album, timestamp, callback) {
    lastfm_api.scrobble(artist, track, album, timestamp, callback);
}

function start_web_auth() {
    var callback_url = chrome.runtime.getURL(SETTINGS.callback_file);
    chrome.tabs.create({
        'url': 'http://www.last.fm/api/auth?api_key=' + 
            SETTINGS.api_key + 
            '&cb=' + callback_url
    });
}
