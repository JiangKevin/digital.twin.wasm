const shapeName = "shape"

// 
const sphere = new FM_GLOBAL.OPENCASCADE.BRepPrimAPI_MakeSphere_1(1);

// Take shape and subtract a translated and scaled sphere from it
function makeCut(shape, translation, scale, oc) {
    const tf = new oc.gp_Trsf_1();
    tf.SetTranslation_1(new oc.gp_Vec_4(translation[0], translation[1], translation[2]));
    tf.SetScaleFactor(scale);
    const loc = new oc.TopLoc_Location_2(tf);

    const cut = new oc.BRepAlgoAPI_Cut_3(shape, sphere.Shape().Moved(loc, false), new oc.Message_ProgressRange_1());
    cut.Build(new oc.Message_ProgressRange_1());

    return cut.Shape();
};
// 
// Let's make some cuts
const cut1 = makeCut(sphere.Shape(), [0, 0, 0.7], 1,FM_GLOBAL.OPENCASCADE);
const cut2 = makeCut(cut1, [0, 0, -0.7], 1,FM_GLOBAL.OPENCASCADE);
const cut3 = makeCut(cut2, [0, 0.25, 1.75], 1.825,FM_GLOBAL.OPENCASCADE);
const cut4 = makeCut(cut3, [4.8, 0, 0], 5,FM_GLOBAL.OPENCASCADE);
//
function makePolygon(oc) {
    //
    const aPnt1 = new oc.gp_Pnt_3(-50, 0, 0);
    const aPnt2 = new oc.gp_Pnt_3(50, 0, 0);
    const aPnt3 = new oc.gp_Pnt_3(50, 100, 0);
    //
    const builder = new oc.BRep_Builder();
    const aComp = new oc.TopoDS_Compound();
    builder.MakeCompound(aComp);
    //
    const newPolygon = new oc.BRepBuilderAPI_MakePolygon_3(aPnt1, aPnt2, aPnt3, true);
    const wire = newPolygon.Wire();
    const f = new oc.BRepBuilderAPI_MakeFace_15(wire, false);
    //
    builder.Add(aComp, f.Shape());
    //
    return aComp;
}
//
function testShape() {
    FM_GLOBAL.CAD_SCENE.remove(FM_GLOBAL.CAD_SCENE.getObjectByName(shapeName));
    let polygon = makePolygon(FM_GLOBAL.OPENCASCADE);
    FMCAS_.addVisulizeShapeToScene(FM_GLOBAL.OPENCASCADE, polygon, FM_GLOBAL.CAD_SCENE, shapeName);
}
//
testShape();
