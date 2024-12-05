const axios = require("axios");
const promise = require("bluebird");
const pgp = require("pg-promise")({ promiseLib: promise });
const fs = require("fs");
const path = require("path");
var ServerConfig = JSON.parse(fs.readFileSync(path.join(__dirname, `../config.json`), "utf8"));
const db = pgp(
  "postgres://" +
    ServerConfig.config.PostGisServer.user +
    ":" +
    ServerConfig.config.PostGisServer.password +
    "@" +
    ServerConfig.config.PostGisServer.ip +
    ":" +
    ServerConfig.config.PostGisServer.port +
    "/" +
    ServerConfig.config.PostGisServer.db
);
const uuid = require("uuid-v4");
const moment = require("moment");
//////////////////////////////////////
//
//
//
//
//////////////////////////////////////
function node_http_request_json(res, records_fle, name) {
  axios({
    method: "post",
    url: "http://" + ServerConfig.config.WasmBackstageServer.ip + ":" + ServerConfig.config.WasmBackstageServer.port + "/" + name,
    data: records_fle,
  }).then(function (response) {
    // console.log(response.data);
    //
    res.send(response.data);
  });
}
//
function select_osm_polygon_of_building(req, res) {
  //
  var lat = req.query.lat;
  var lon = req.query.lon;
  var radius = req.query.radius;
  //
  //
  var sql =
    "SELECT t.osm_id,t.building,t.name,t.way_area,t.z_order,t.way, ST_AsText(t.way) as geom FROM public.planet_osm_polygon t where ST_DWithin(ST_GeographyFromText('SRID=4326;POINT(" +
    lon +
    " " +
    lat +
    ")'),ST_Transform(t.way,4326)," +
    radius +
    ") and building='yes' order by osm_id;";
  //
  console.log(sql);
  var json_name = "./tmp/" + req.query.lon + "-" + req.query.lat + ".json";
  var work_file = ServerConfig.config.workFolder + "/" + req.query.lon + "-" + req.query.lat + ".json";
  // 读取记录
  db.any(sql)
    .then((records) => {
      // fs.writeFileSync(json_name, JSON.stringify(records));
      //
      node_http_request_json(res, JSON.stringify(records), "osm_building_2_ply");
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
  select_value_of_coal_seam_for_where(req, res, "");
}
//
function select_value_of_coal_seam_for_where(req, res, where) {
  //
  var sql_prefix =
    "SELECT SIGN_UUID,SIGN_NAME,LOCATION_X,LOCATION_Y,LOCATION_Z,DIRECTION_X,DIRECTION_Y,DIRECTION_Z,GEO_TYPE,BIG_CATEGORY,MEDIUM_CATEGORY,SMALL_CATEGORIES,ST_AsEWKT(ZOON) as zoon FROM public.coal_seam t";
  var sql_suffix = "ORDER BY sign_uuid ASC";
  var sql_where = "";
  var sql = "";
  //
  if (where != "") {
    sql_where = "where" + " " + req.query.where;
    sql = sql_prefix + " " + sql_where + " " + sql_suffix;
  } else {
    sql = sql_prefix + " " + sql_suffix;
  }
  //
  console.log(sql);
  //
  var json_name = "./tmp/" + uuid() + ".json";
  // 读取记录
  db.any(sql)
    .then((records) => {
      fs.writeFileSync(json_name, JSON.stringify(records));
      res.send("get_coal_seam success.");
      //
      // records.forEach((record) => {
      //   // console.log(record);
      // });
    })
    .catch((error) => {
      console.error("Error reading records: " + error.message);
    });
}
//
function insert_to_coal_seam_of_test(req, res) {
  //
  const date = new Date();
  const formattedDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
  //
  var sql =
    "INSERT INTO public.coal_seam(	sign_uuid, sign_name, location_x, location_y, location_z, direction_x, direction_y, direction_z, efficient, geo_type, big_category, medium_category, small_categories, creation_time, update_time, zoon) VALUES (${sign_uuid}, ${sign_name}, ${location_x}, ${location_y}, ${location_z}, ${direction_x}, ${direction_y}, ${direction_z}, ${efficient}, ${geo_type}, ${big_category}, ${medium_category}, ${small_categories}, ${creation_time}, ${update_time}, ${zoon})";
  // 创建记录
  const createRecord = {
    sign_uuid: uuid(),
    sign_name: "test",
    location_x: 0.0,
    location_y: 0.0,
    location_z: 0.0,
    direction_x: 0.0,
    direction_y: 0.0,
    direction_z: 0.0,
    efficient: true,
    geo_type: "TIN",
    big_category: "IDA",
    medium_category: "MINE",
    small_categories: "SURFACE",
    creation_time: formattedDate,
    update_time: formattedDate,
    zoon: "TIN (((0 0 0, 0 0 1, 0 1 0, 0 0 0)), ((0 0 0, 0 1 0, 1 1 0, 0 0 0)))",
  };

  //
  db.none(sql, createRecord)
    .then(() => {
      // console.log("Record created successfully");
      res.send("new_coal_seam success.");
    })
    .catch((error) => {
      console.error("Error creating record: " + error.message);
    });
}
//
function insert_to_coal_seam(req, res) {
  insert_to_coal_seam_of_test(req, res);
}
//////////////////////////////////////
//
//
//
//
//////////////////////////////////////
module.exports = {
  select_osm_polygon_of_building,
  select_value_of_coal_seam,
  insert_to_coal_seam,
};
