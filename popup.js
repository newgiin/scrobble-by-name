window.onload = main;


var bp;

function main() {
    chrome.runtime.getBackgroundPage(function(backgroundPage) {
        bp = backgroundPage;
        document.getElementById('scrble_form').onsubmit = scrobble;
        render_login_link();
    });
}

function scrobble() {
    var artist = document.getElementById('artist').value;
    var track = document.getElementById('track').value;
    var album = document.getElementById('album').value;
    var timestamp = Math.floor((new Date()).getTime() / 1000) - 240;
    bp.lastfm_api.scrobble(artist, track, album, timestamp, 
            function(result) {
                var statusField = document.getElementById('status');
                if (result.error) {
                    statusField.className = 'fail';
                    statusField.innerHTML = 'Scrobble Failed: ' +
                       '<a href="http://www.last.fm/api/show/track.scrobble" target="_blank">' + 
                        result.error + '</a>'; 
                } else {
                    statusField.className = 'success';
                    statusField.innerHTML = 'Scrobbled!';
                    document.getElementById('scrble_form').reset();
                } 
            }); 
    return false;
}

function render_login_link() {
    var auth_link = document.getElementById('auth_link');
    var user_link = document.getElementById('user');
    if (bp.lastfm_api.session.name && bp.lastfm_api.session.key) {
        auth_link.innerHTML = '<img src="img/logout.png" alt="logout"/>'; 
        auth_link.onclick = logout;
        user_link.setAttribute('href', 'http://www.last.fm/user/' +
                bp.lastfm_api.session.name);
        user_link.setAttribute('target', '_blank');
        user_link.innerHTML = bp.lastfm_api.session.name;
    } else {
        auth_link.innerHTML = 'login';
        auth_link.onclick = login;
        user_link.setAttribute('href', '#');
        user_link.removeAttribute('target');
        user_link.innerHTML = '';
    }
}

function login() {
   bp.start_web_auth();
   window.close();
}

function logout() {
    bp.clear_session();
    render_login_link(); 
}
