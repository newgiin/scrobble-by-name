function _url_param(name, url) {
    return unescape((RegExp(name + '=' +
        '(.+?)(&|$)').exec(url) || [,null])[1]);
}
chrome.runtime.getBackgroundPage(function(background) {
    //location.href = "http://last.fm/";
    background.get_lastfm_session(_url_param("token", location.search));
});
