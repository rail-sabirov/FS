// set data to hha.fs from HHAexchange

//const regex = /https:\/\/(\w*)\.hhaexchange\.com\/ENT(\d{4})010000\/.*/gm;
const regex = new RegExp('https:\\\/\\\/(\\w*)\\.hhaexchange\\.com\\\/ENT(\\d{4})010000\\\/.*', 'gm');
const lsKey = 'hha.fs-data';
const url = location.href;
let res;

regex.lastIndex = 0; // Reset Globaly index
while ((res = regex.exec(url)) !== null) {
  const dt = res[2];

  if (!localStorage.getItem(lsKey) || localStorage.getItem(lsKey) !== dt) {
    GM_xmlhttpRequest({
      method: "GET",
      url: `http://hha.fs/set-yymm/${dt}`,
      onload: function(response) {
        console.log(JSON.parse(response.responseText).message);
      }
    });

    localStorage.setItem(lsKey, dt);
  }
}
