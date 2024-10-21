const oc = FM_GLOBAL.OPENCASCADE;
//
const builder = new oc.BRep_Builder();
const aComp = new oc.TopoDS_Compound();
builder.MakeCompound(aComp);
const path = [[-50, 0, 0], [50, 0, 0], [50, 100, 0]].map(([x, y, z]) => new oc.gp_Pnt_3(x, y, z));
const makePolygon = new oc.BRepBuilderAPI_MakePolygon_3(path[0], path[1], path[2], true);
const wire = makePolygon.Wire();
const f = new oc.BRepBuilderAPI_MakeFace_15(wire, false);
builder.Add(aComp, f.Shape());
// 
FM_GLOBAL.modelUrl = FMCAS_.addVisualizeShapesToView(oc, aComp);


