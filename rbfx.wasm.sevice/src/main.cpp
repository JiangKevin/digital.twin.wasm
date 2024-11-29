#include <httplib.h>
//
#include "expand/cgal_do.h"
#include "expand/postgis_do.h"
//
int main( void )
{
    using namespace httplib;
    //
    Server      svr;
    int         service_port = 1234;
    std::string base_path    = "/Users/kevin.jiang/Dev/src/github-res/digital.twin.wasm/rbfx.wasm.apps.server/tmp/";
    //
    svr.Get( "/hi",
             [ &base_path ]( const Request& req, Response& res )
             {
                 FM::test( base_path + "out.mesh" );
                 FM_DB::testDb();
                 //
                 res.set_content( "Hello World!", "text/plain" );
             } );

    // Match the request path against a regular expression
    // and extract its captures
    svr.Get( R"(/numbers/(\d+))",
             [ & ]( const Request& req, Response& res )
             {
                 auto numbers = req.matches[ 1 ];
                 res.set_content( numbers, "text/plain" );
             } );

    // Extract values from HTTP headers and URL query params
    svr.Get( "/body-header-param",
             []( const Request& req, Response& res )
             {
                 if ( req.has_header( "Content-Length" ) )
                 {
                     auto val = req.get_header_value( "Content-Length" );
                 }
                 if ( req.has_param( "key" ) )
                 {
                     auto val = req.get_param_value( "key" );
                 }
                 res.set_content( req.body, "text/plain" );
             } );

    svr.Get( "/stop",
             [ & ]( const Request& req, Response& res )
             {
                 svr.stop();
             } );
    //
    printf( "+- common.sevice run at port %d ... \n", service_port );
    //
    svr.listen( "localhost", service_port );
}
