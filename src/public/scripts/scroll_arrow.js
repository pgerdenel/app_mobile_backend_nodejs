let tab = ['/', '/panel', '/actu', '/part', '/viewdata', '/contact', '/image'];
let current_tab = -1;

$(document).ready(function(){

    $( "#arrowl" ).click(function() {
        window.open(tab[get_prev_tab()],"_self");
        return false;
    });

    $( "#arrowr" ).click(function() {
        window.open(tab[get_next_tab()],"_self");
        return false;
    });

});

function get_current_tab() {
    current_tab = $("#body").attr("data-tab");
    return current_tab;
}

function get_next_tab() {
    if(get_current_tab() === "6") {
        return 0;
    }
    else {
        return parseInt(get_current_tab()) + 1;
    }
}

function get_prev_tab() {
    if(get_current_tab() === "0") {
        return 0;
    }
    else {
        return parseInt(get_current_tab()) - 1;
    }
}
