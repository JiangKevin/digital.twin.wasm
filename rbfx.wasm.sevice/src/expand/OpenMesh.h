#pragma once
//
#include <boost/geometry.hpp>
#include <boost/geometry/geometries/linestring.hpp>
#include <boost/geometry/geometries/point_xy.hpp>
#include <boost/geometry/geometries/polygon.hpp>
#include <boost/graph/adjacency_list.hpp>
#include <fstream>
#include <OpenMesh/Core/IO/MeshIO.hh>
#include <OpenMesh/Core/Mesh/PolyMesh_ArrayKernelT.hh>
#include <nlohmann/json.hpp>
#include <queue>

//
namespace FM
{

    namespace bg = boost::geometry;
    typedef bg::model::point< double, 2, bg::cs::cartesian > bg_point_t;
    typedef bg::model::polygon< bg_point_t >                 bg_polygon_t;
    typedef OpenMesh::PolyMesh_ArrayKernelT<>                PostGis_Mesh;
    //
    static bool include_str( std::string long_str, std::string short_str )
    {
        // 全部切换大写
        transform( long_str.begin(), long_str.end(), long_str.begin(), ::toupper );
        transform( short_str.begin(), short_str.end(), short_str.begin(), ::toupper );
        //
        std::string::size_type idx;
        //
        idx = long_str.find( short_str );  // 在a中查找b.
        if ( idx == std::string::npos )    // 不存在
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    //
    static int osm_building_2_ply( std::string json_file, std::string fileName )
    {
        //
        std::ifstream  f( json_file );
        nlohmann::json building_json = nlohmann::json::parse( f );
        //
        for ( int index_of_json = 0; index_of_json < building_json.size(); index_of_json++ )
        {
            std::string wkt_tmp( building_json[ index_of_json ][ "geom" ].get< std::string >() );
            // 判断geom的类型
            if ( include_str( wkt_tmp, "Polygon" ) )  //
            {
                bg_polygon_t bg_geom;
                boost::geometry::read_wkt( wkt_tmp, bg_geom );
                // 有孔
                if ( bg_geom.inners().size() > 0 )
                {
                    printf( "+- Have inner: %d (%s) \n", bg_geom.inners().size(), building_json[ index_of_json ][ "osm_id" ].get< std::string >().c_str() );
                    // 外边
                    for ( int out_index = 0; out_index < bg_geom.outer().size(); out_index++ )
                    {
                        double x = bg::get< 0 >( bg_geom.outer()[ out_index ] );
                        double y = bg::get< 1 >( bg_geom.outer()[ out_index ] );
                        //
                        printf( "+- outer: %f , %f (%d)\n", x, y, out_index );
                    }
                    // 内孔
                    for ( int in_index = 0; in_index < bg_geom.inners().size(); in_index++ )
                    {
                        for ( int in_in_index = 0; in_in_index < bg_geom.inners()[ in_index ].size(); in_in_index++ )
                        {
                            double x = bg::get< 0 >( bg_geom.inners()[ in_index ][ in_in_index ] );
                            double y = bg::get< 1 >( bg_geom.inners()[ in_index ][ in_in_index ] );
                            //
                            printf( "+- inners(%d): %f , %f \n", in_index, x, y );
                        }
                    }
                }
                else
                {
                    //
                }
            }
        }
        //
        return 0;
    }

}  // namespace FM