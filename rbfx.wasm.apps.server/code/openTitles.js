
function calculateTileXY(lon, lat, level) {
    var xy = { x: 0, y: 0 }
    var n = 2.0 ** level;
    // 
    xy.x = Math.floor((lon + 180) / 360.0 * n)
    // 
    xy.y = Math.floor((90 - lat) / 360.0 * n)
    // 
    return xy;
}

// 
var level = 18;
var lon = 106.58828259
var lat = 29.56782092
// 
var xy = calculateTileXY(lon, lat, level);
console.log(xy)
//
var url = "https://t2.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL=" + xy.x + "&TILEROW=" + xy.y + "&TILEMATRIX=" + level + "&tk=0f18f726f31c645d24cb9708cec73576"
window.open(url, "_blank", "resizable,scrollbars,status");
