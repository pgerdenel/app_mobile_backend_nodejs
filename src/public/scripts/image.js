$( document ).ready(function() {

    let tab_view_object_image = [];
    let current_upload={"id_value":"", "url_value":"", "index_value":"", "view_name_value":""};

    let old_id = "";
    let old_url ="";

    /* Events */
    let input_file_name = "file_upload";
    let input_file_upload_jquery = $("#file_upload");
    let btn_valid_upload = $('.btn_valid_upload');
    let input_file_upload_js=document.getElementById(input_file_name);

    /*$("#list-img-btn").on("click", handler_list_img_btn);*/
    $("#list-img-btn").on("click", handler_list_img_btn);
    $(".help_btn").on("click", refreshDisplayImage);

    /*input_file_upload.on("click");*/
    input_file_upload_jquery.on("change", function() {
        console.log("onchange calledn, l'utilisateur a ajouté une image depuis l'explorateur");

        let file_input=document.getElementById(input_file_name);
        /*console.log("file_input.value= "+input_file_upload_jquery.value);
        console.log("file_input.files= "+JSON.stringify(input_file_upload_jquery.files));
        console.log("file_input.files.name= "+JSON.stringify(input_file_upload_jquery.files.name));
        console.log("file_input.files[0]= "+JSON.stringify(input_file_upload_jquery.files[0]));
        console.log("file_input.files[0].name= "+input_file_upload_jquery.files[0].name);*/

        if(validateImageExtension(file_input) && checkHeader(file_input.file)) {
            console.log('le bouton "remplacer" disparait et le bouton "uploader" apparait');
            // le bouton remplacer disparait
            $(".c_replace").css("display", "none");
            // le bouton uploader apparait
            $(".btn_valid_upload").css("display", "block");

        }
        else {
            console.log("l'image est incorrecte");
            clean_input_file();
            console.log("le style des boutons est mis à jour");
            set_style_btn();
            console.log("la fenêtre modal se ferme IMG_incorrect");
            $('a[name=modal_close]').click();
        }

    });
    setGlobalModalListenners();

    // fonction permettant d'afficher les images
    function displayImage() {
        httpGet('/api/image/all')
            .then(response => response.json())
            .then((response) => {
                tab_view_object_image = [];
                //console.log("empty?= "+isEmptyObject(response));
                if (!isEmptyObject(response)) {
                    show_toast("Liste d'images mises à jour !", "", "note", 1500);
                    //console.log("response= " + JSON.stringify(response));
                    //console.log("type response= "+typeof response);

                   // Formattage des images reçues (4types)

                   for(let i =0;i<response.length;i++) {
                       let obj = {
                           view_name : response[i].view_name,
                           list_img : response[i].list_img,
                           _id : response[i]._id,
                           single: response[i].single
                       };
                       //console.log("obj= "+obj.view_name);
                       tab_view_object_image.push(obj);
                    }

                    //console.log("all_image_format = "+JSON.stringify(tab_view_object_image));
                    tab_view_object_image = tab_view_object_image.reverse();
                    // Empty the anchor
                    let allImageAnchor = document.getElementById('wrapper_image');
                    allImageAnchor.innerHTML = '';
                    for(let i=0;i<tab_view_object_image.length;i++) {
                        allImageAnchor.innerHTML += getImageDisplayEle(tab_view_object_image[i]);
                    }
                    setImageListenners();
                }
                else {
                    console.log("empty object ");
                    show_toast("Liste d'images indisponibles !", "La liste d'image n'a pas été récupérée", "warning");
                }
            })
            .catch((error) => {
                console.log("error retrieve list "+error);
                show_toast("Erreur de récupération de la liste !", "Veuillez rééssayer plus tard", "error");
            });
    }
    // fonction permettant de mettre à jour la gallerie sans devoir recharger toute les images du serveur
    // from pour soit depuis le remplacement d'une image soit depuis la suppression d'une image
    function updateDisplayImage(data, from) {

        $(".modal").remove();
        show_toast("Image mis à jour !", "", "note", 1500);
        console.log("updateDisplayImage data= " + JSON.stringify(data));
        console.log("old_id= "+old_id);
        console.log("old_url= "+ old_url);
        //console.log("current tab_view_object_image= " + JSON.stringify(tab_view_object_image));

        if(from === "del") {
            console.log("from del");
            let new_tab = [];
            let img_tab;
            // DELETE
            // on parcourt le tableau d'image courant
            console.log("on parcourt le tableau d'objet image courant");
            for (let i = 0; i < tab_view_object_image.length; i++) {
                console.log("index i ="+i);
                // on cherche l'image
                if (tab_view_object_image[i]._id === old_id) {
                        console.log("oui un ID matche !");
                        for (let j = 0; j < (tab_view_object_image[i].list_img).length; j++) {
                            console.log("est ce que l'url "+tab_view_object_image[i].list_img[j] + " matche le old url= "+old_url);
                            if (tab_view_object_image[i].list_img[j] === old_url) {
                                console.log("array refait = "+JSON.stringify(tab_view_object_image[i].list_img));
                                console.log("oui un url match ! --> "+tab_view_object_image[i].list_img[j]);
                                let ele_del = tab_view_object_image[i].list_img.splice(j, 1);
                                console.log("element supprimé= "+ele_del);
                                console.log("array refait = "+JSON.stringify(tab_view_object_image[i].list_img));
                                break;
                            }
                        }
                }
            }

            //tab_view_object_image = tab_view_object_image.reverse();
        }
        else {
            // UPDATE on recherche dans le tableau d'image local, l'objet portant l'id data.id
            for (let i = 0; i < tab_view_object_image.length; i++) {
                if (tab_view_object_image[i]._id === data.id) {
                    for (let j = 0; j < tab_view_object_image[j].list_img.length; j++) {
                        if (tab_view_object_image[i].list_img[j] === old_url) {
                            console.log("IF DU UPDATE");
                            tab_view_object_image[i].list_img[j] = data.new_url;
                            break;
                        }
                    }
                }
            }
        }

        console.log("new current tab_view_object_image= " + JSON.stringify(tab_view_object_image));
        // Empty the anchor
        console.log("on reconstruit l'anchor");
        let allImageAnchor = document.getElementById('wrapper_image');
        allImageAnchor.innerHTML = '';

        for (let i = 0; i < tab_view_object_image.length; i++) {
            console.log("tab_view_object_image[i] i= "+i+" = "+JSON.stringify(tab_view_object_image[i]));
            allImageAnchor.innerHTML += getImageDisplayEle(tab_view_object_image[i]);
        }
        setImageListenners();
    }
    function refreshDisplayImage() {
        let allImageAnchor = document.getElementById('wrapper_image');
        allImageAnchor.innerHTML = '';

        for (let i = 0; i < tab_view_object_image.length; i++) {
            console.log("tab_view_object_image[i] i= "+i+" = "+JSON.stringify(tab_view_object_image[i]));
            allImageAnchor.innerHTML += getImageDisplayEle(tab_view_object_image[i]);
        }
        setImageListenners();
    }
    // fonction qui génére le HTML de la gallerie d'image
    function getImageDisplayEle(obj) {
        let obj_format = "";
        for(let i =0;i<obj.list_img.length;i++) {
            //console.log("obj.view_name= "+obj.view_name);
            let class_name = ((obj.view_name === "1")?"gal_img_color":(obj.view_name === "2")?"actu_img_color":(obj.view_name === "3")?"prez_img_color":(obj.view_name === "4")?"home_img_color":"bizare");
            //console.log("class_name= "+class_name);
            obj_format +=
            `
            <div id="${i+obj._id}" class="modal imgpopup">
                <div id="control${i+obj._id}" class="control" >
                    <span class="c_zoom" id="zoom${i+obj._id}" ><a href="${obj.list_img[i]}" data-id="${obj._id}" data-index="${i}" target="_blank">Zoomer</a></span>
                    <span class="c_delete" id="delete${i+obj._id}" data-id="${obj._id}" data-url="${obj.list_img[i]}">Supprimer</span></p>
                    <span class="c_replace" id="replace${i+obj._id}" data-id="${obj._id}" data-url="${obj.list_img[i]}" data-index="${i}" data-view-name="${obj.view_name}">Replace</span>
                    <button style="display:none;" class="btn_valid_upload small-btn" >Envoyer</button>
                </div>
                <div class="wrapper_image_zoom"><img alt="" width="400" height="300"  src="${obj.list_img[i]}"></div>
                <a id="modal${i+obj._id}" name="modal_close" class="alink_modal" href="#" rel="modal:close" data-id="${obj._id}" data-index="${i}" data-modal></a>
            </div>
       
            <div id="wmodal${i+obj._id}" class="holder ${class_name}" data-id="${obj._id}" data-index="${i}">
            <a id="modal${i+obj._id}" name="modal_close" class="alink_modal" href="#${i+obj._id}" data-index="${i}" rel="modal:open" data-modal>
                <img alt="" src="${obj.list_img[i]}" data-id="${obj._id}" data-index="${i}">
            </a>
            </div>
            `;
        }
        return obj_format;
    }

    //handler_list_img_btn
    function handler_list_img_btn() {
        disable_temp("#list-img-btn", 1000);
        displayImage();
    }
    // handler_help_btn
    function handler_help_btn() {
        show_toast("Catégories d'images", "Une catégorie pour chaque couleur ! <br/>" +
            "<span class=\"home_txt_color\">Acceuil </span> - \n" +
            "<span class=\"prez_txt_color\">Présentation</span> -\n" +
            "<span class=\"actu_txt_color\">Actualité </span> - \n" +
            "<span class=\"gal_txt_color\">Gallerie</span>", "info", false)
    }
    // handler_c_delete
    function handler_c_delete(event) {
        disable_temp(".c_delete", 5000);
        console.log("c_delete clicked by one of them ^^");
        console.log("event= "+event);
        console.log("event.target= "+event.target);
        console.log("event.target.nodeName= "+event.target.nodeName);
        let id_value = $(event.target).attr("data-id");
        let url_value = $(event.target).attr("data-url");
        console.log("handler_c_delete val= "+id_value);
        console.log("handler_c_delete val= "+url_value);
        old_id = id_value;
        old_url = url_value;
        console.log("handler_c_delete old_id= "+old_id);
        console.log("handler_c_delete old_url= "+old_url);
        deleteImage(id_value, url_value, event);
    }
    //handler_c_replace
    function handler_c_replace(event) {
        console.log("################################## c_replace cliked #############################################");

        event.preventDefault();

        let c_replace_btn = $(".c_replace");
        disable_temp(c_replace_btn, 3000);

        // on récupère les données de ce bouton
        let id_value = $(event.target).attr("data-id");
        let url_value = $(event.target).attr("data-url");
        let index_value = $(event.target).attr("data-index");
        let view_name_value = $(event.target).attr("data-view-name");


        console.log("id_value= "+id_value);
        console.log("url_value= "+url_value);
        console.log("index_value= "+index_value);
        console.log("view_name_value= "+view_name_value);
        console.log("input id = "+"#file_upload"+index_value+id_value);

        current_upload.id_value = id_value;
        current_upload.url_value = url_value;
        current_upload.index_value = index_value;
        current_upload.view_name_value = view_name_value;

        // on clique sur le bouton input type file
        input_file_upload_jquery.click();

        console.log("######################################################################################");
    }

    // fonction permettant de se mettre en écoute d'évenement suppresion et remplaceement d'image lorsqu'ils sont ajoutés au DOM
    function setImageListenners() {
        $(".c_delete").on( "click", handler_c_delete);
        $(".c_replace").on( "click", handler_c_replace);
        // on se met en écoute du click sur le bouton upload
        $('.btn_valid_upload').on("click", function (event) {
            disable_temp(btn_valid_upload, 2000);
            console.log("################################# btn_valid_upload click CALLED");
            upload(current_upload.id_value, current_upload.url_value, current_upload.index_value, current_upload.view_name_value);
        });
    }
    // fonction permetttant de se mettre en écoute d'"evenement sur la modal
    function setGlobalModalListenners() {
        // on se met en écoute d'evenement de fermeture sur les modals pour supprimer les images de l'input et remettre les css en display
        $(document).on('modal:before-close', function(event) {
            //console.log("BEFORE CLOSE");
            //console.log("le fenêtre modal s'ouvre, on clean l'input par précaution");
            set_style_btn();
            clean_input_file();
        });
        // on se met en écoute d'evenement de fermeture sur les modals pour supprimer les images de l'input et remettre les css en display
        $(document).on('modal:before-open', function(event) {
            //console.log("le fenêtre modal s'ouvre, on clean l'input par précaution");
            //console.log("BEFORE CLOSE");
            /*let target = event.target;
            let a = $(event.target).find('.c_replace');
            let id_value = $(a).attr("data-id");
            let index_value = a.attr("data-index");
            console.log("id_value= "+id_value);
            console.log("index_value= "+index_value);*/
            set_style_btn();
            clean_input_file();
        });
    }

    // Valide une image d'un bon format image
    function validateImageExtension(file_input) {
        console.log("vérification de l'extension de l'image");
        // Allowing file type
        let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        /*console.log("file_input.value= "+file_input.value);
        console.log("file_input.files= "+JSON.stringify(file_input.files));
        console.log("file_input.files.name= "+JSON.stringify(file_input.files.name));
        console.log("file_input.files[0]= "+JSON.stringify(file_input.files[0]));
        console.log("file_input.files[0].name= "+file_input.files[0].name);*/
        console.log("extension= "+(file_input.files[0].name).split(".")[1].toUpperCase());

        if (!allowedExtensions.exec(file_input.value)) {
            alert('fichier incorrect');
            clean_input_file();
        }
        else {
            console.log("fichier correcte");
            return true;
        }
    }
    // Vérifie l'en entête binaire d'une image
    function checkHeader(file_input) {
        console.log("vérification de l'header de l'image");
        /*const blob = file_input.file[0]; // See step 1 above
        const fileReader = new FileReader();
        fileReader.onloadend = function(e) {
            const arr = (new Uint8Array(e.target.result)).subarray(0, 4);
            let header = "";
            for(let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            console.log(header);
            let type;
            // Check the file signature against known types
            switch (header) {
                case "89504e47":
                    type = "image/png";
                    break;
                case "47494638":
                    type = "image/gif";
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    type = "image/jpeg";
                    break;
                default:
                    type = "unknown"; // Or you can use the blob.type as fallback
                    break;
            }

        };
        fileReader.readAsArrayBuffer(blob);*/
        console.log("header correcte");
        return true;
    }
    // fonction permettant d'upload l'image
    function upload(id_value, url_value, index_value, view_name_value) {
        console.log("################################# upload #######################################");
        console.log("upload called");
        console.log("id_value= "+ id_value);
        console.log("url_value= "+ url_value);
        console.log("index_value= "+ index_value);
        console.log("view_name_value= "+ view_name_value);

        // on stocke l'ancienne ID et ancienne URL de l'image qui va être remplacée
        old_id = id_value;
        old_url = url_value;
        console.log("upload old_id= "+old_id);
        console.log("upload old_url= "+ old_url);

        let file_upload_id_computed = "#file_upload";
        let file = document.getElementById(file_upload_id_computed.substr(1, file_upload_id_computed.length));

        // on vérifie que le fichier de l'utilisateur à mis un fichier
        if(file.value.length !== 0){
            console.log("Ok fichier selectionné et format correcte");
            console.log("file_upload.value= " + file.value);
            console.log("file_upload.files= " + JSON.stringify(file.files));
            console.log("file_upload.files.name= " + JSON.stringify(file.files.name));
            console.log("file_upload.files[0]= " + JSON.stringify(file.files[0]));
            console.log("file_upload.files[0].name= " + file.files[0].name);


            // on envoie le form data avec l'image
            if(file.files[0]) {
                let formdata = new FormData();
                console.log("file.file[0] ="+JSON.stringify(file.files[0]));
                formdata.append("img", file.files[0], file.files[0].name); // ajoute l'image
                formdata.append("id", id_value); // ajoute l'id de l'image
                formdata.append("view_name", view_name_value); // ajoute le nom de la vue
                formdata.append("url_img", url_value); // ajoute l'url actuelle de l'image

                /*(view_name_value === "4")?"/image/upload_and_update_image_home":"undefined";
                (view_name_value === "3")?"/image/upload_and_update_image_prez":"";
                (view_name_value === "2")?"/image/upload_and_update_image_actu":"";
                (view_name_value === "1")?"/image/upload_and_update_image_gallery":"";*/

                let url = (view_name_value === "1")?"/image/upload_and_update_image_gallery":(view_name_value === "2")?"/image/upload_and_update_image_actu":(view_name_value === "3")?"/image/upload_and_update_image_prez":(view_name_value === "4")?"/image/upload_and_update_image_home":"undefined";
                console.log("url= "+url);

                let requestOptions = {
                    method: 'POST',
                    /*headers: myHeaders,*/
                    body: formdata
                };
                console.log("envoie de la nouvelle image \n");
                upload_image(url, requestOptions, index_value, id_value);
            }
            else {
                alert("aucun fichier selectionné");
                show_toast("Attention !", "Vous n'avez pas selectionné d'image", "warning");
                set_style_btn();
                $('a[name=modal_close]').click();
            }
        }
        else {
            console.log("Aucun fichier selectionné ou le format est incorrecte");
            set_style_btn();
            $('a[name=modal_close]').click();
        }
    }

    // fonction permettant la call au web service "upload d'image"
    function upload_image(url, requestOptions) {
        fetch("/api"+url, requestOptions)
            .then(response => response.json())
            .then((result) => {
                console.log("success replace fetch nouvelle image =" + JSON.stringify(result));
                if(result.state === "ok") {
                    show_toast("Image mise à jour !", "La nouvelle image a bien été enregistrée", "success");
                    clean_input_file();
                    check_input_have_file();
                    set_style_btn();
                    $('a[name=modal_close]').click();
                    console.log("######################################################################################");
                    updateDisplayImage(result.data);
                }
                else {
                    show_toast("Erreur de mise à jour !", "La nouvelle image n'a pas été enregistrée", "warning");
                    set_style_btn();
                    $('a[name=modal_close]').click();
                    clean_input_file();
                }

            })
            .catch((error) => {
                console.log('error replace fetch nouvelle image', JSON.stringify(error));
                show_toast("Erreur de mise à jour !", "Veuillez réésayer plus tard", "error");
                set_style_btn();
                $('a[name=modal_close]').click();
                clean_input_file();
            });
    }
    // fonction permettant la call au web service "suppression d'image"
    function deleteImage(id_value, url_value) {
        console.log("deleteImage called : ID="+id_value+", URL= "+url_value);
        httpPost('/api/image/delete', {"id": id_value, "url":url_value})
            .then(response => response.json())
            .then((response) => {
                if(response.state === "ok") {
                    $('a[name=modal_close]').click();
                    show_toast("Supprimée avec succès !", "L'image a bien été supprimée", "success");
                    updateDisplayImage({"state":"ok", "data":{"id":old_id, "url_to_del":old_url}}, "del");
                }
                else {
                    $('a[name=modal_close]').click();
                    show_toast("Echec de suppresion !", "L'image n'a pas été supprimée", "warning");
                }

            })
            .catch((error) => {
                console.log("erreur de suppression de l'image "+error);
                show_toast("Erreur de suppresion !", "Veuillez rééssayer plus tard", "error");
            });
    }

    // fonction permettant de réafficher le bouton "remplacer" et de cacher le bouton "uploader"
    function set_style_btn() {
        //console.log("bouton remplacer 'visible' et bouton uploadé 'caché'");
        $('.btn_valid_upload').css("display", "none");
        $(".c_replace").css("display", "block");
    }
    function set_style_btn_upload() {
        //console.log("bouton uploadé 'visible' et bouton remplacer 'caché'");
        $('.btn_valid_upload').css("display", "block");
        $(".c_replace").css("display", "none");
    }
    // fonction qui clean l'input
    function clean_input_file() {
        //console.log("l'input est nettoyé");
        document.getElementById("file_upload").value = '';
        input_file_upload_jquery.val('');
    }
    // vérifie si l'input a encore un fichier
    function check_input_have_file() {
        let file_upload_id_computed = "#file_upload";
        let file = document.getElementById(file_upload_id_computed.substr(1, file_upload_id_computed.length));

        if(file.files[0]) {
            console.log("l'input a encore un fichier");
        }
        else {
            console.log("l'input est clean, aucun fichier");
        }
    }

    // fonction retournant une requêtes d'un type construite
    function httpGet(path) {
        return fetch(path, getOptions('GET'));
    }
    function getOptions(verb, data) {
        const options = {
            dataType: 'json',
            method: verb,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        return options;
    }
    function httpPost(path, data) {
        return fetch(path, getOptions('POST', data));
    }
});

// fonction qui vérifie si un objet est vivant
function isEmptyObject(obj) {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}


