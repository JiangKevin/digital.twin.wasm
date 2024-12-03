#include <httplib.h>
//
#include "expand/cgal_do.h"
// #include "expand/cgal_test.h"
//
int main( void )
{
    using namespace httplib;
    //
    Server      svr;
    int         service_port = 1234;
    std::string base_path    = "/Users/kevin.jiang/Dev/src/github-res/digital.twin.wasm/rbfx.wasm.apps.server/tmp/";
    //
    svr.Get( "/stop",
             [ & ]( const Request& req, Response& res )
             {
                 svr.stop();
             } );
    //
    svr.Get( "/hi",
             [ &base_path ]( const Request& req, Response& res )
             {
                 res.set_content( "Hello World!", "text/plain" );
             } );
    //
    svr.Post( "/osm_building_2_ply",
              [ & ]( const Request& req, Response& res, const ContentReader& content_reader )
              {
                  std::string body;
                  content_reader(
                      [ & ]( const char* data, size_t data_length )
                      {
                          body.append( data, data_length );
                          //
                          FM::osm_building_2_ply( body, base_path + "building.ply" );
                          //
                          return true;
                      } );

                  //
                  res.set_content( "osm_building_2_ply ok!", "text/plain" );
              } );

    //
    printf( "+- common.sevice run at port %d ... \n", service_port );
    //
    svr.listen( "localhost", service_port );
}
