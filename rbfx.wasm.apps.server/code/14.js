function dd(oc) {
    const builder = new oc.BRep_Builder();
    const aComp = new oc.TopoDS_Compound();
    builder.MakeCompound(aComp);
    // 
    const path = [[-50, 0, 0], [50, 0, 0], [50, 100, 0]].map(([x, y, z]) => new oc.gp_Pnt_3(x, y, z));
    const makePolygon = new oc.BRepBuilderAPI_MakePolygon_3(path[0], path[1], path[2], true);
    const wire = makePolygon.Wire();
    const f = new oc.BRepBuilderAPI_MakeFace_15(wire, false);
    builder.Add(aComp, f.Shape());
    // 
    return aComp;
}



FM_GLOBAL.CAD_SCENE.remove(FM_GLOBAL.CAD_SCENE.getObjectByName("shape"));

FMCAS_.addVisulizeShapeToScene(FM_GLOBAL.OPENCASCADE, dd(FM_GLOBAL.OPENCASCADE), FM_GLOBAL.CAD_SCENE, "shape");