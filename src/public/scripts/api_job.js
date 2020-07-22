/* Fonction permettant de désactiver un element temporairement */
function disable_temp(id_ele, timeout) {
    $(id_ele).prop('disabled', true);
    setTimeout(function() {
        $(id_ele).prop('disabled', false);
    }, timeout);
}
/* Fonction qui vérifie si un string est plus grand que la 1ere longueur passé en paramètre et plus petit que la 2eme */
function check_length(chaine, length_small, length_high) {
    console.log("##################### DEBUT ##############################");
    let bool = false;
    if(chaine) {
        console.log("chaine >="+length_small+"="+ (chaine.length >= length_small));
        console.log("chaine <= "+length_high+"="+ (chaine.length <= length_high));
        if((chaine.length >= length_small && chaine.length <= length_high)) {
            console.log("chaine checké= |"+chaine+"|");
           bool = true;
        }
        else {
            console.log("check_length chaine= |"+chaine+"| not passed");
        }
    }
    else {
        console.log("chaine undefined= false");
    }

    return bool;
}
