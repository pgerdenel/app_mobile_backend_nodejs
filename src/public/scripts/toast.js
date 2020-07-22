/* génère un toast sur demande
 * icon = 'info', 'success', 'warning', 'error'
*/
function show_toast(titre, text, icon, delay_hide) {
    let back_color = (icon ==='info')?'#4f69ff':(icon ==='warning')?'#ffba0c':(icon ==='success')?'#2bde4c':(icon ==='error')?'#FF2C1D':'#4f69ff';
    //let delay_hide = (icon ==='info')?4000:(icon ==='warning')?4000:(icon ==='success')?4000:(icon ==='error')?'#FF2C1D':5000;
    let d_hide = (delay_hide === false || delay_hide > 0)?delay_hide:5000;
    return $.toast({
        heading: titre,
        text: text,
        icon: icon,
        loader: true,        // Change it to false to disable loader
        loaderBg: 'white',  // To change the background
        bgColor: back_color,
        textColor: 'white',
        textAlign: 'center',
        hideAfter: d_hide,   // in milli seconds
        showHideTransition: 'plain',
        position: 'top-left',
    });
}
/* update un toast existant */
function update_toast(toast, titre, text, icon) {
    toast.update({
        heading: titre,
        text: text,
        icon: icon,
        hideAfter: false
    });
}
