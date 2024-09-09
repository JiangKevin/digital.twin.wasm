//
function busy_div_control(div_name, is_view) {
    var select_div = document.getElementById(div_name);
    select_div.style = "";
    select_div.style.display = "";
    if (is_view) {
        select_div.style.display = "block";
    } else {
        select_div.style.visibility = 'hidden';
        select_div.style.display = 'none';
    }
}
//
busy_div_control("other_log", true);