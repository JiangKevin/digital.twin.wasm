const fm_dt_load_ok_event = new Event("DT_LOAD_PROJECT_OK");
// 监听该事件。
// window.addEventListener(
//     "DT_LOAD_PROJECT_OK",
//     (e) => {
//         console.log("new !!!")
//     },
//     false,
// );
window.dispatchEvent(fm_dt_load_ok_event);