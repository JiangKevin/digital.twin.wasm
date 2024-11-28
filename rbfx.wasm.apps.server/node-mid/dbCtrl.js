const promise = require("bluebird");
const pgp = require("pg-promise")({ promiseLib: promise });
const db = pgp("postgres://postgres:kevin@192.168.1.102:5432/SpaceDb");
const fs = require("fs");
//////////////////////////////////////
//
//
//
//
//////////////////////////////////////
function select_osm_polygon_of_building(req, res) {
  //
  var lat = req.query.lat;
  var lon = req.query.lon;
  var sql =
    "SELECT t.osm_id,t.name, ST_AsText(t.way) as geom FROM public.planet_osm_polygon t where ST_DWithin(ST_GeographyFromText('SRID=4326;POINT(" +
    lon +
    " " +
    lat +
    ")'),ST_Transform(t.way,4326),100);";
  //
  //   console.log(sql);
  var json_name = "./tmp/" + req.query.lon + "-" + req.query.lat + ".json";

  // 读取记录
  db.any(sql)
    .then((records) => {
      fs.writeFileSync(json_name, JSON.stringify(records));
      //
      records.forEach((record) => {
        // console.log(record);
        // fs.writeFileSync(json_name, JSON.stringify(record));
      });
    })
    .catch((error) => {
      console.error("Error reading records: " + error.message);
    });
}

//////////////////////////////////////
//
//
//
//
//////////////////////////////////////
module.exports = {
  select_osm_polygon_of_building,
};

// SELECT ST_AsText(ST_Transform(t.way,4326)), ST_X(ST_Transform(t.way,4326)), ST_Y(ST_Transform(t.way,4326))  FROM public.planet_osm_polygon t where ST_DWithin(ST_GeographyFromText('SRID=4326;POINT(113.678425 34.796591666)'),ST_Transform(t.way,4326),1000) LIMIT 100;
