const promise = require("bluebird");
const pgp = require("pg-promise")({ promiseLib: promise });
const db = pgp("postgres://postgres:kevin@192.168.1.102:5432/SpaceDb");
const fs = require("fs");
const uuid = require("uuid-v4");
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
  //
  //
  var sql =
    "SELECT t.osm_id,t.name, ST_AsText(t.way) as geom FROM public.planet_osm_polygon t where ST_DWithin(ST_GeographyFromText('SRID=4326;POINT(" +
    lon +
    " " +
    lat +
    ")'),ST_Transform(t.way,4326),100) and building='yes';";
  //
  console.log(sql);
  var json_name = "./tmp/" + req.query.lon + "-" + req.query.lat + ".json";

  // 读取记录
  db.any(sql)
    .then((records) => {
      fs.writeFileSync(json_name, JSON.stringify(records));
      //
      records.forEach((record) => {
        // console.log(record);
      });
    })
    .catch((error) => {
      console.error("Error reading records: " + error.message);
    });
}
//
// -- Table: public.coal_seam
// -- DROP TABLE IF EXISTS public.coal_seam;
// CREATE TABLE IF NOT EXISTS PUBLIC.COAL_SEAM (
// 	SIGN_UUID UUID NOT NULL,
// 	NAME TEXT COLLATE PG_CATALOG."default",
// 	LOCATION_X NUMERIC,
// 	LOCATION_Y NUMERIC,
// 	LOCATION_Z NUMERIC,
// 	DIRECTION_X NUMERIC,
// 	DIRECTION_Y NUMERIC,
// 	DIRECTION_Z NUMERIC,
// 	EFFICIENT BOOLEAN,
// 	GEO_TYPE TEXT COLLATE PG_CATALOG."default",
// 	BIG_CATEGORY TEXT COLLATE PG_CATALOG."default",
// 	MEDIUM_CATEGORY TEXT COLLATE PG_CATALOG."default",
// 	SMALL_CATEGORIES TEXT COLLATE PG_CATALOG."default",
// 	CREATION_TIME TIMESTAMP WITHOUT TIME ZONE,
// 	UPDATE_TIME TIMESTAMP WITHOUT TIME ZONE,
// 	ZOON GEOMETRY,
// 	CONSTRAINT COAL_SEAM_PKEY PRIMARY KEY (SIGN_UUID)
// ) TABLESPACE PG_DEFAULT;

// ALTER TABLE IF EXISTS PUBLIC.COAL_SEAM OWNER TO POSTGRES;

// TABLESPACE pg_default;

// ALTER TABLE IF EXISTS public.coal_seam
//     OWNER to postgres;
//
function select_value_of_coal_seam(req, res) {
  //
  //
  var sql_prefix =
    "SELECT SIGN_UUID,SIGN_NAME,LOCATION_X,LOCATION_Y,LOCATION_Z,DIRECTION_X,DIRECTION_Y,DIRECTION_Z,GEO_TYPE,BIG_CATEGORY,MEDIUM_CATEGORY,SMALL_CATEGORIES,ST_AsEWKT(ZOON) FROM public.coal_seam t";
  var sql_suffix = "ORDER BY sign_uuid ASC";
  var sql_where = "";
  var sql = "";
  //
  if (req.query.where != "") {
    sql_where = "where" + " " + req.query.where;
    sql = sql_prefix + " " + sql_where + " " + sql_suffix;
  } else {
    sql = sql_prefix + " " + sql_suffix;
  }
  //
  console.log(sql);
  //
  var json_name = uuid() + ".json";
  // 读取记录
  db.any(sql)
    .then((records) => {
      fs.writeFileSync(json_name, JSON.stringify(records));
      //
      // records.forEach((record) => {
      //   // console.log(record);
      // });
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
