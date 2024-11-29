// // table
// -- Table: public.coal_seam

// -- DROP TABLE IF EXISTS public.coal_seam;

// CREATE TABLE IF NOT EXISTS public.coal_seam
// (
//     id integer NOT NULL DEFAULT nextval('coal_seam_id_seq'::regclass),
//     name text COLLATE pg_catalog."default",
//     efficient boolean,
//     creation_time timestamp without time zone,
//     update_time timestamp without time zone,
//     zoon geometry,
//     CONSTRAINT coal_seam_pkey PRIMARY KEY (id)
// )

// TABLESPACE pg_default;

// ALTER TABLE IF EXISTS public.coal_seam
//     OWNER to postgres;

#pragma once

#include <iostream>
// #include <pqxx/pqxx>
//
namespace FM_DB
{
    static int testDb()
    {
        // std::string connectionString = "dbname=SpaceDb user=postgres password=kevin hostaddr=192.168.1.102 port=5433";
        // //
        // pqxx::connection cx{ connectionString.c_str() };
        // pqxx::work       tx{ cx };
        // //
        // for ( auto [ id, wkt ] : tx.query< std::string, int >( "SELECT osm_id,ST_AsEWKT(zoon) FROM public.coal_seam ORDER BY id ASC ;" ) )
        // {
        //     std::cout << id << " wkt " << wkt << ".\n";
        // }

        // // Update the employee's salary.  Use exec() to perform the command, and
        // // no_rows() to check that it produces no result rows.  If the result does
        // // contain data, this will throw an exception.
        // //
        // // The employee ID shows up in the query as "$1"; that means we'll pass it as
        // // a parameter.  Pass all parameters together in a single "params" object.
        // tx.exec( "UPDATE EMPLOYEE "
        //          "SET salary = salary + 1 "
        //          "WHERE id = $1",
        //          pqxx::params{ employee_id } )
        //     .no_rows();

        // // Make our change definite.
        // tx.commit();
    }
}