function LastFM(api_key, api_secret) {
    this.API_KEY = api_key;
    this.API_SECRET = api_secret || '';
    this.API_ROOT = 'http://ws.audioscrobbler.com/2.0/';

    this.session = {};
}

LastFM.prototype.scrobble = 
    function(artist, track, album, timestamp, callback) {
        var params = {
            'api_key': this.API_KEY,
            'method': 'track.scrobble',
            'artist': artist,
            'track': track,
            'album': album || '',
            'timestamp': timestamp,
            'sk': this.session.key
        }
        params.api_sig = this._get_sig(params);
        params.format = 'json';

        this._xhr('POST', params,
            function(result) {
                callback(result);
            });
    };

LastFM.prototype.authorize = function(token, callback) {
    var params = {
        'api_key': this.API_KEY,
        'method': "auth.getSession",
        'token': token
    };

    params.api_sig = this._get_sig(params);
    params.format = "json";
    
    var self = this;

    this._xhr("GET", params, 
        function(reply) {
            if (!reply.error) {
                self.session.key = reply.session.key;
                self.session.name = reply.session.name;
                callback(reply);
            }
            else {
                callback(reply);
            }
        });
};

LastFM.prototype._get_sig = function(params) {
        var keys = [];
        var sig = '';
        
        for (var key in params) {
            keys.push(key);
        }
        keys.sort();

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            sig += key + params[key];
        }
        sig += this.API_SECRET;
        return hex_md5(sig);
    }
LastFM.prototype._xhr = function(method, params, callback) {
        var uri = this.API_ROOT;
        var _data = "";
        var _params = [];
        var xhr = new XMLHttpRequest();
        
        for(param in params) {
            _params.push(encodeURIComponent(param) + "="
                + encodeURIComponent(params[param]));
        }
        
        switch(method) {
            case "GET":
                uri += '?' + _params.join('&').replace(/%20/, '+');
                break;
            case "POST":
                _data = _params.join('&');
                break;
            default:
                return;
        }
        
        xhr.open(method, uri);
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var reply;
                
                try {
                    reply = JSON.parse(xhr.responseText);
                }
                catch (e) {
                    reply = null;
                }
                
                callback(reply);
            }
        };

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.send(_data || null);
    }
