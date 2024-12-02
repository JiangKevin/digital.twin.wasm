#pragma once
//
// #include "op/implicit_functions.h"
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/IO/File_medit.h>
// #include <CGAL/IO/File_poly.h>
#include "Color_ramp.h"
#include <CGAL/Classification.h>
#include <CGAL/Constrained_Delaunay_triangulation_2.h>
#include <CGAL/Constrained_triangulation_plus_2.h>
#include <CGAL/Delaunay_triangulation_2.h>
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
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
#include <CGAL/draw_polygon_with_holes_2.h>
#include <CGAL/draw_surface_mesh.h>
#include <CGAL/draw_triangulation_2.h>
#include <CGAL/draw_triangulation_3.h>
#include <CGAL/make_mesh_3.h>
#include <boost/graph/adjacency_list.hpp>
#include <fstream>
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
#ifdef CGAL_LINKED_WITH_TBB
    using Concurrency_tag = CGAL::Parallel_tag;
#else
    using Concurrency_tag = CGAL::Sequential_tag;
#endif
    //
    static int osm_building_2_ply( std::string json, std::string fileName )
    {
        // Read points
        std::ifstream                ifile( fileName, std::ios_base::binary );
        CGAL::Point_set_3< Point_3 > points;
        ifile >> points;
        std::cerr << points.size() << " point(s) read" << std::endl;
        // Create DSM
        TIN dsm( points.points().begin(), points.points().end() );
        using Mesh = CGAL::Surface_mesh< Point_3 >;
        Mesh dsm_mesh;
        CGAL::copy_face_graph( dsm, dsm_mesh );
        std::ofstream dsm_ofile( "dsm.ply", std::ios_base::binary );
        CGAL::IO::set_binary_mode( dsm_ofile );
        CGAL::IO::write_PLY( dsm_ofile, dsm_mesh );
        dsm_ofile.close();

        //
        return 0;
    }

}  // namespace FM