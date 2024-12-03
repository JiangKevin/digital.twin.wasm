#pragma once
//
// #include "op/implicit_functions.h"
#include "Color_ramp.h"
#include <CGAL/Classification.h>
#include <CGAL/Constrained_Delaunay_triangulation_2.h>
#include <CGAL/Constrained_triangulation_plus_2.h>
#include <CGAL/Delaunay_triangulation_2.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/IO/File_medit.h>
#include <CGAL/IO/WKT.h>
#include <CGAL/Implicit_to_labeling_function_wrapper.h>
#include <CGAL/Labeled_mesh_domain_3.h>
#include <CGAL/Mesh_complex_3_in_triangulation_3.h>
#include <CGAL/Mesh_criteria_3.h>
#include <CGAL/Mesh_triangulation_3.h>
#include <CGAL/Point_set_3.h>
#include <CGAL/Point_set_3/IO.h>
#include <CGAL/Polygon_mesh_processing/border.h>
#include <CGAL/Polygon_mesh_processing/locate.h>
#include <CGAL/Polygon_mesh_processing/remesh.h>
#include <CGAL/Polygon_mesh_processing/triangulate_hole.h>
#include <CGAL/Polyhedral_mesh_domain_with_features_3.h>
#include <CGAL/Polyhedron_3.h>
#include <CGAL/Polyline_simplification_2/Squared_distance_cost.h>
#include <CGAL/Polyline_simplification_2/simplify.h>
#include <CGAL/Projection_traits_xy_3.h>
#include <CGAL/Random.h>
#include <CGAL/Surface_mesh.h>
#include <CGAL/Timer.h>
#include <CGAL/Triangulation_face_base_with_info_2.h>
#include <CGAL/Triangulation_vertex_base_with_info_2.h>
#include <CGAL/boost/graph/copy_face_graph.h>
#include <CGAL/boost/graph/graph_traits_Delaunay_triangulation_2.h>
#include <CGAL/boost/graph/split_graph_into_polylines.h>
#include <CGAL/compute_average_spacing.h>
#include <CGAL/convex_hull_3.h>
#include <CGAL/make_mesh_3.h>
#include <boost/geometry.hpp>
#include <boost/geometry/geometries/linestring.hpp>
#include <boost/geometry/geometries/point_xy.hpp>
#include <boost/geometry/geometries/polygon.hpp>
#include <boost/graph/adjacency_list.hpp>
#include <fstream>
// #include <geos/geom/Geometry.h>
// #include <geos/geom/GeometryFactory.h>
// #include <geos/io/WKTReader.h>
// #include <geos/io/WKTWriter.h>
#include <nlohmann/json.hpp>
#include <queue>
//
namespace FM
{
    using Kernel            = CGAL::Exact_predicates_inexact_constructions_kernel;
    using Projection_traits = CGAL::Projection_traits_xy_3< Kernel >;
    using Point_2           = Kernel::Point_2;
    using Point_3           = Kernel::Point_3;
    using Segment_3         = Kernel::Segment_3;
    // Triangulated Irregular Network
    using TIN = CGAL::Delaunay_triangulation_2< Projection_traits >;
    // Triangulated Irregular Network (with info)
    using Point_set          = CGAL::Point_set_3< Point_3 >;
    using Vbi                = CGAL::Triangulation_vertex_base_with_info_2< Point_set::Index, Projection_traits >;
    using Fbi                = CGAL::Triangulation_face_base_with_info_2< int, Projection_traits >;
    using TDS                = CGAL::Triangulation_data_structure_2< Vbi, Fbi >;
    using TIN_with_info      = CGAL::Delaunay_triangulation_2< Projection_traits, TDS >;
    namespace Classification = CGAL::Classification;
    namespace PS             = CGAL::Polyline_simplification_2;
    using CDT_vertex_base    = PS::Vertex_base_2< Projection_traits >;
    using CDT_face_base      = CGAL::Constrained_triangulation_face_base_2< Projection_traits >;
    using CDT_TDS            = CGAL::Triangulation_data_structure_2< CDT_vertex_base, CDT_face_base >;
    using CDT                = CGAL::Constrained_Delaunay_triangulation_2< Projection_traits, CDT_TDS >;
    using CTP                = CGAL::Constrained_triangulation_plus_2< CDT >;
    using Mesh               = CGAL::Surface_mesh< Point_3 >;
    namespace bg             = boost::geometry;
    typedef bg::model::point< double, 2, bg::cs::cartesian > bg_point_t;
    typedef bg::model::polygon< bg_point_t >                 bg_polygon_t;
    /* Geometry/GeometryFactory */
    // using namespace geos::geom;
    /* WKTReader/WKTWriter */
    // using namespace geos::io;
    using Concurrency_tag = CGAL::Sequential_tag;
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
        if ( idx == std::string::npos )         // 不存在
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
        Mesh merge_sm;
        // //
        // GeometryFactory::Ptr factory = GeometryFactory::create();
        // WKTReader            reader( *factory );
        //
        std::ifstream  f( json_file );
        nlohmann::json building_json = nlohmann::json::parse( f );
        //
        for ( int i = 0; i < building_json.size(); i++ )
        {
            std::string wkt_tmp( building_json[ i ][ "geom" ].get< std::string >() );
            // 判断geom的类型
            if ( include_str( wkt_tmp, "Polygon" ) )  //
            {
                bg_polygon_t bg_geom;
                boost::geometry::read_wkt( wkt_tmp, bg_geom );
                //
                std::cout << "+- Have inner: " << bg_geom.inners().size() << std::endl;
            }

            // /* Convert WKT to Geometry */
            // std::unique_ptr< Geometry > geom_tmp( reader.read( wkt_tmp ) );
            // auto                        m_coordiate = geom_tmp->getCoordinates();
            //
            // printf( "+- polygon coordiate size %d(%d)\n", m_coordiate->getSize(), i );
            // //
            // if ( geom_tmp->getGeometryType() == "Polygon" )
            // {
            //     Mesh                              sm_bottom;
            //     std::vector< Mesh::Vertex_index > pvs_bottom;
            //     std::vector< Mesh::Vertex_index > pvs_top;
            //     //
            //     for ( int n = 0; n < m_coordiate->getSize(); n++ )
            //     {
            //         long double x = m_coordiate->getAt( n ).x;
            //         long double y = m_coordiate->getAt( n ).y;
            //         printf( "+- polygon coordiate %lf,%lf,%lf,(%d)(%d)\n", x, y, 0, i, n );
            //         //
            //         Point_3            p_bottom( x, y, 0 );
            //         Mesh::Vertex_index pv_bottom = sm_bottom.add_vertex( p_bottom );
            //         pvs_bottom.push_back( pv_bottom );
            //     }
            //     int triangle_count = pvs_bottom.size() / 3;
            //     // 简单的简历三角形
            //     for ( int n = 0; n < triangle_count; n++ )
            //     {
            //         sm_bottom.add_face( pvs_bottom[ 3 * n ], pvs_bottom[ 3 * n + 1 ], pvs_bottom[ 3 * n + 2 ] );
            //     }
            //     //
            //     // Mesh ch_bottom;
            //     // 之后利用算法补足其他面
            //     // CGAL::convex_hull_3( sm_bottom.points().begin(), sm_bottom.points().end(), ch_bottom );
            //     //
            //     merge_sm += sm_bottom;
            // }

            //
        }
        // //
        // std::ofstream of( fileName );
        // CGAL::IO::write_PLY( of, merge_sm );
        // of.close();
        //
        return 0;
    }

}  // namespace FM