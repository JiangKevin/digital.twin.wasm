function Angle2Radians(angle) {
    //
    return (angle * Math.PI) / 180;
}
function GetTileUrlForCoordinate(lon, lat, level) {
    //
    var n = Math.pow(2, level);
    var xtile = parseInt(Math.floor(((lat + 180) / 360) * n));
    console.log(xtile);
    //
    var ytile = parseInt(Math.floor(((1 - Math.log(Math.tan(Angle2Radians(lon)) + 1 / Math.cos(Angle2Radians(lon))) / Math.PI) / 2) * n));
    console.log(ytile);
    //
    return "/" + level + "/" + xtile + "/" + ytile + ".pbf";
}
// 
console.clear()
GetTileUrlForCoordinate(47.346715,8.31372,14)