# Digital Twin Editor

<img src="./runtime/img/coveralls_100.svg" class=img_left />

## Key objects retained by the system

-   FM_GLOBAL.DTWIN:Object names exposed by the Digital Twin Designer。Secondary packaging, namespace FM\_;

## Digital Twin Editor for js function list

<details open>
<summary>function list</summary>

|                                       | Function return value | Number of parameters                                                         | Function Description                                                                                                         | Calling Example                                                                                                                                                              |
| ------------------------------------- | --------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CreateChild                           | void                  | char\* name                                                                  | Create a node for the scene. The name cannot be empty. It is used as a unique identifier to locate the node.                 | `FM_.CreateChild("Hello")` or `FM_GLOBAL.DTWIN.cwrap('CreateChild', '', ['string'])('Hello');`                                                                               |
| RemoveChild                           | void                  | char\* name                                                                  | Remove a node for the scene. The name cannot be empty. It is used as a unique identifier to locate the node.                 | `FM_.RemoveChild("Hello")` or `FM_GLOBAL.DTWIN.cwrap('RemoveChild', '', ['string'])('Hello');`                                                                               |
| set_node_enbled                       | void                  | char\* name, bool enble                                                      | Enble or disable a node for the scene                                                                                        | slightly or `FM_GLOBAL.DTWIN.cwrap('set_node_enbled', '', ['string','bool'])('Hello',true);`                                                                                 |
| set_node_position                     | void                  | char\* name, float x, float y, float z                                       | set a node position for the scene                                                                                            | slightly or `FM_GLOBAL.DTWIN.cwrap('set_node_position', '', ['string','float','float','float'])('Hello',0,0,0);`                                                             |
| set_node_direction                    | void                  | char\* name, float x, float y, float z                                       | set a node direction for the scene                                                                                           | slightly or `FM_GLOBAL.DTWIN.cwrap('set_node_direction', '', ['string','float','float','float'])('Hello',0,0,0);`                                                            |
| set_node_scale                        | void                  | char\* name, float x, float y, float z                                       | set a node scale for the scene                                                                                               | slightly or `FM_GLOBAL.DTWIN.cwrap('set_node_scale', '', ['string','float','float','float'])('Hello',0,0,0);`                                                                |
| create_child_by_node                  | void                  | char* node_name, char* child_name                                            | Add a child node to the specified node                                                                                       | slightly or `FM_GLOBAL.DTWIN.cwrap('create_child_by_node', '', ['string','string'])('Hello',‘Hello1’);`                                                                      |
| remove_node_by_name                   | void                  | char\* name                                                                  | Remove a child node by the node name                                                                                         | slightly or `FM_GLOBAL.DTWIN.cwrap('remove_node_by_name', '', ['string'])('Hello');`                                                                                         |
| create_component_by_node              | void                  | char* node_name, char* type_name                                             | Add various components to the specified node                                                                                 | slightly or `FM_GLOBAL.DTWIN.cwrap('create_child_by_node', '', ['string','string'])('Hello',‘Camera’);`                                                                      |
| remove_component_by_node              | void                  | char* node_name, char* type_name                                             | Remove various components from the specified node                                                                            | slightly or `FM_GLOBAL.DTWIN.cwrap('remove_component_by_node', '', ['string','string'])('Hello',‘Camera’);`                                                                  |
| set_component_attr_by_node            | void                  | char* node_name, char* com_type_name, char* attr_type_name, char* attr_value | Modify the specified attribute of the specified node. The attribute value is passed in as a string, separated by commas [,]. | slightly or `FM_GLOBAL.DTWIN.cwrap('set_component_attr_by_node', '', ['string','string','string','string'])('Zone', 'Zone', 'Bounding Box Min', '-1000.0,-1000.0,-1000.0');` |
| call_component_default_init_by_node   | void                  | char* node_name, char* com_type_name                                         | Calling the initialization method of complex business components                                                             | slightly or `FM_GLOBAL.DTWIN.cwrap('call_component_default_init_by_node', '', ['string','string'])('Floor','FmFloor');`                                                      |
| call_component_default_method_by_node | void                  | char* node_name, char* com_type_name                                         | Calling the event start of complex components                                                                                | slightly or `FM_GLOBAL.DTWIN.cwrap('call_component_default_method_by_node', '', ['string','string'])('Floor','FmFloor');`                                                    |
| set_node_attr                         | void                  | char* node_name, char* attr_type_name, char\* attr_value                     | Sets the properties of the specified node                                                                                    | slightly or `FM_GLOBAL.DTWIN.cwrap('set_node_attr', '', ['string','string','string'])('DirectionalLight', 'Rotation', '43.0,35.0,14.0');`                                    |
| SetupViewport                         | void                  | char\* camera_node_name                                                      | Setting the Viewport                                                                                                         | slightly or `FM_GLOBAL.DTWIN.cwrap('SetupViewport', '', ['string'])('FreeCamera');`                                                                                          |
| LoadSceneFromFile                     | void                  | char\* fileName                                                              | Loading a scene sequence file                                                                                                | slightly or `FM_GLOBAL.DTWIN.cwrap('LoadSceneFromFile', '', ['string'])('/IndexedDB/dd/Scene/main.xml');`                                                                    |
| Clear                                 | void                  | void                                                                         | Clear all nodes and components in the scene                                                                                  | slightly or `FM_GLOBAL.DTWIN.cwrap('Clear', '', [''])();`                                                                                                                    |

</details>
<!--  -->
<details >
<summary>AngelScript Demo</summary>

-   test.hpp

```
float RestAndCreateScene()
{
    scene_ptr.Clear();
    //
    scene_ptr.create_component_by_node( "Scene", "Octree" );
    scene_ptr.create_component_by_node( "Scene", "PhysicsWorld" );
    //
    scene_ptr.CreateChild( "Zone" );
    scene_ptr.create_component_by_node( "Zone", "Zone" );
    scene_ptr.set_component_attr_by_node( "Zone", "Zone", "Bounding Box Min", "-1000.0,-1000.0,-1000.0" );
    scene_ptr.set_component_attr_by_node( "Zone", "Zone", "Bounding Box Max", "1000.0,1000.0,1000.0" );
    scene_ptr.set_component_attr_by_node( "Zone", "Zone", "Ambient Color", "0.15,0.15,0.15,1.0" );
    scene_ptr.set_component_attr_by_node( "Zone", "Zone", "Fog Color", "0.5,0.5,0.7,1.0" );
    scene_ptr.set_component_attr_by_node( "Zone", "Zone", "Fog Start", "100.0" );
    scene_ptr.set_component_attr_by_node( "Zone", "Zone", "Fog End", "300.0" );
    //
    scene_ptr.CreateChild( "DirectionalLight" );
    scene_ptr.set_node_position( "DirectionalLight", 0.3, -0.5, 0.15 );

    scene_ptr.set_node_attr( "DirectionalLight", "Rotation", "43.0,35.0,14.0" );
    scene_ptr.create_component_by_node( "DirectionalLight", "Light" );
    scene_ptr.set_component_attr_by_node( "DirectionalLight", "Light", "Light Type", "0" );
    scene_ptr.set_component_attr_by_node( "DirectionalLight", "Light", "Cast Shadows", "True" );
    scene_ptr.set_component_attr_by_node( "DirectionalLight", "Light", "Color", "1.0,1.0,1.0,1.0" );
    //
    scene_ptr.CreateChild( "Floor" );
    scene_ptr.set_node_position( "Floor", 0.0, -0.5, 0.0 );
    scene_ptr.set_node_scale( "Floor", 200.0, 1.0, 200.0 );
    scene_ptr.create_component_by_node( "Floor", "FmFloor" );
    scene_ptr.call_component_default_init_by_node( "Floor", "FmFloor" );
    //
    scene_ptr.CreateChild( "FreeCamera" );
    scene_ptr.set_node_position( "FreeCamera", 0.0, 2.5, 0.0 );
    scene_ptr.create_component_by_node( "FreeCamera", "Camera" );
    scene_ptr.set_component_attr_by_node( "FreeCamera", "Camera", "Far Clip", "300.0" );

    //
    scene_ptr.CreateChild( "Jack" );
    scene_ptr.create_component_by_node( "Jack", "FmKinematicCharacter" );
    scene_ptr.call_component_default_init_by_node( "Jack", "FmKinematicCharacter" );
    scene_ptr.create_component_by_node( "Jack", "CollisionShape" );
    //
    scene_ptr.SetupViewport( "FreeCamera" );
    return 0;
}

```

-   project.cxx

```
#include "test.hpp"
int main()
{
    RestAndCreateScene();
    return 0;
}
```

</details>

<!--  -->
<details >
<summary>JavaScript Demo</summary>

```
//
function RestAndCreateScene() {
  FM_.create_child_by_node("Box1", "Box2");
  FM_.set_node_position("Box1", 0, 20, 0);
  FM_.set_node_direction("Box1", 0, 20, 0);
  FM_.set_node_scale("Box1", 1, 1.2, 1);
  FM_.create_component_by_node("Box2", "FmFloor");

}
//
RestAndCreateScene();
```

</details>

# OpenCasCad Editor

<img src="./runtime/img/coveralls_5.svg" class=img_left />

## Key objects retained by the system

-   FM_GLOBAL.CAD_SCENE:The reference to the scene global object created retains the name;
-   FM_GLOBAL.OPENCASCADE:The reference to the cascad global object created retains the name;
-   FM_GLOBAL.TWEAKPANLE:The reference to the tweak panle global object created retains the name;

## Overview

A typical application developed using OCCT deals with two or three-dimensional (2D or 3D) geometric modeling in general-purpose or specialized Computer Aided Design (CAD) systems, manufacturing or analysis applications, simulation applications, or even illustration tools.

<img src="./runtime/img/technical_overview_schema.png" class=img_left_max /><img src="./runtime/img/dot_schema_all_modules.png" class=img_left_max />

-   Foundation Classes module underlies all other OCCT classes;
-   Modeling Data module supplies data structures to represent 2D and 3D geometric primitives and their compositions into CAD models;
-   Modeling Algorithms module contains a vast range of geometrical and topological algorithms;
-   Mesh toolkit from "Modeling Algorithms" module implements tessellated representations of objects;
-   Visualization module provides complex mechanisms for graphical data representation;
-   Data Exchange module inter-operates with popular data formats and relies on Shape Healing to improve compatibility between CAD software of different vendors;
-   Application Framework module offers ready-to-use solutions for handling application-specific data (user attributes) and commonly used functionality (save/restore, undo/redo, copy/paste, tracking CAD modifications, etc).

The diagram above illustrates this modular structure.