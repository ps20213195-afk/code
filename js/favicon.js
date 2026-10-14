//FYI: this is the only human code in the js folder 
//use document.title to change the title of the page
//use changeFavicon('new-favicon-url') to change the favicon of the page
const favicon = document.getElementById('favicon');
function changeFavicon(newFaviconUrl) {
    favicon.href = newFaviconUrl;
}
