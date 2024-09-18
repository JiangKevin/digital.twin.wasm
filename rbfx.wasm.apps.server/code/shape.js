//
function makePolygon(openCascade) {
    //
    const aPnt1 = new openCascade.gp_Pnt_3(-50, 0, 0);
    const aPnt2 = new openCascade.gp_Pnt_3(50, 0, 0);
    const aPnt3 = new openCascade.gp_Pnt_3(50, 100, 0);
    //
    const builder = new openCascade.BRep_Builder();
    const aComp = new openCascade.TopoDS_Compound();
    builder.MakeCompound(aComp);
    //
    const newPolygon = new openCascade.BRepBuilderAPI_MakePolygon_3(aPnt1, aPnt2, aPnt3, true);
    const wire = newPolygon.Wire();
    const f = new openCascade.BRepBuilderAPI_MakeFace_15(wire, false);
    //
    builder.Add(aComp, f.Shape());
    //
    return aComp;
}
//
function testShape() {
    FM_GLOBAL.CAD_SCENE.remove(FM_GLOBAL.CAD_SCENE.getObjectByName("shape"));
    let polygon = makePolygon(FM_GLOBAL.OPENCASCADE);
    FMCAS_.addVisulizeShapeToScene(FM_GLOBAL.OPENCASCADE, polygon, FM_GLOBAL.CAD_SCENE, "shape");
}
//
testShape();
