$( document ).ready(function() {

    /* Events */
    $("#list-img-btn").click(function() {
        disable_temp("#list-img-btn", 1000);
        displayImage();
    });
    $(".help_btn").click(function() {
        show_toast("Catégories d'images", "Une catégorie pour chaque couleur ! <br/>" +
            "<span class=\"home_txt_color\">Acceuil </span> - \n" +
            "<span class=\"prez_txt_color\">Présentation</span> -\n" +
            "<span class=\"actu_txt_color\">Actualité </span> - \n" +
            "<span class=\"gal_txt_color\">Gallerie</span>", "info", false)
    });

    /******************************************************************************
     *                          Fetch and display actus
     ******************************************************************************/
    function displayImage() {
        httpGet('/api/image/all')
            .then(response => response.json())
            .then((response) => {
                //console.log("empty?= "+isEmptyObject(response));
                if (!isEmptyObject(response)) {
                    show_toast("Liste d'images mises à jour !", "", "note", 1500);
                    //console.log("response= " + JSON.stringify(response));
                    //console.log("type response= "+typeof response);

                   // Formattage des images reçues (4types)
                   let tab_view_object_image = [];

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
                    // Append actu to anchor
                    tab_view_object_image.forEach((obj) => {
                        allImageAnchor.innerHTML += getImageDisplayEle(obj);
                        setListennerOnControl();
                    });
                }
                else {
                    console.log("empty object ");
                    show_toast("Liste d'images indisponibles !", "La liste d'image n'a pas été récupérée", "warning");
                }
            })
            .catch((error) => {
                show_toast("Erreur de récupération de la liste !", "Veuillez rééssayer plus tard", "error");
            });
    }
    function setListennerOnControl() {
        $(".c_delete").on( "click", function(event) {
            disable_temp(".c_delete", 1000);
            console.log("c_delete clicked by one of them ^^");
            console.log("event= "+event);
            console.log("event.target= "+event.target);
            console.log("event.target.nodeName= "+event.target.nodeName);
            let id_value = $(event.target).attr("data-id");
            let url_value = $(event.target).attr("data-url");
            console.log("val= "+id_value);
            console.log("val= "+url_value);
            deleteImage(id_value, url_value, event);
            // on ferme la modal
            /*let ele = $(event.target.nodeName).find('a[data-id=id_value]');
            console.log(".length= "+ele.length);
            console.log("html= "+ele.html);
            ele.click();*/
        });
        $(".c_replace").on( "click", function(event) {
            disable_temp(".c_replace", 1000);
            console.log("c_replace clicked by one of them ^^");
            //console.log("event= "+event);
            //console.log("event.target= "+event.target);
            //console.log("event.target.nodeName= "+event.target.nodeName);
            let id_value = $(event.target).attr("data-id");
            let url_value = $(event.target).attr("data-url");
            let index_value = $(event.target).attr("data-index");
            let view_name_value = $(event.target).attr("data-view-name");
            console.log("################################## c_replace cliked #############################################");
            console.log("id_value= "+id_value);
            console.log("url_value= "+url_value);
            console.log("index_value= "+index_value);
            console.log("view_name_value= "+view_name_value);
            console.log("input id = "+"#file_upload"+index_value+id_value);
            console.log("######################################################################################");
            let file_upload_id_computed = "#file_upload"+index_value+id_value;
            $(file_upload_id_computed).click();
            // on simule le click sur l'input hidden file upload
            $(file_upload_id_computed).change(function() {
                console.log("#################################f ile_upload_id_computed #######################################");
                disable_temp($(file_upload_id_computed), 5000);
                console.log("file_upload_change called");
                let file = document.getElementById(file_upload_id_computed.substr(1, file_upload_id_computed.length));
                // on vérifie que le fichier de l'utilisateur à mis un fichier
                if(file.value.length !== 0 && validateImage(file)){
                    console.log("Ok fichier selectionné et format correcte");
                    console.log("file_upload.value= " + file.value);
                    console.log("file_upload.files= " + JSON.stringify(file.files));
                    console.log("file_upload.files.name= " + JSON.stringify(file.files.name));
                    console.log("file_upload.files[0]= " + JSON.stringify(file.files[0]));
                    console.log("file_upload.files[0].name= " + file.files[0].name);

                    // on envoie le form data avec l'image
                    if(file.files[0]) {
                        let formdata = new FormData();
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

                        fetch("/api"+url, requestOptions)
                            .then(response => response.json())
                            .then( (result) => {
                                console.log("success replace fetch nouvelle image =" + JSON.stringify(result));
                                if(result.state === "ok") {
                                    show_toast("Image mise à jour !", "La nouvelle image a bien été enregistrée", "success");
                                    // on clear l'input
                                    console.debug("on clear l'input !!!!!!!!!!!!!!!!");
                                    document.getElementById("file_upload"+index_value+id_value).value = '';
                                    $("#file_upload"+index_value+id_value).val('');
                                    let file_upload_id_computed = "#file_upload"+index_value+id_value;
                                    let file = document.getElementById(file_upload_id_computed.substr(1, file_upload_id_computed.length));
                                    if(file.files[0]) {
                                        console.log("un fichier existe encore");
                                    }
                                    else {
                                        console.log("aucun fichier l'input est clean");
                                    }

                                    console.log("######################################################################################");
                                    displayImage();
                                    $('a[name=modal_close]').click();
                                }
                                else {
                                    show_toast("Erreur de mise à jour !", "La nouvelle image n'a pas été enregistrée", "warning");
                                }

                            })
                            .catch((error) => {
                                console.log('error replace fetch nouvelle image', JSON.stringify(error));
                                show_toast("Erreur de mise à jour !", "Veuillez réésayer plus tard", "error");
                            });

                    }
                    else {
                        alert("aucun fichier selectionné");
                        show_toast("Attention !", "Vous n'avez pas selectionné d'image", "warning");
                    }
                }
                else {
                    console.log("Aucun fichier selectionné ou le format est incorrecte");
                    show_toast("Hmmm attention !", "Votre image est très étrange !", "error");
                }
            });
            //disable_temp($(file_upload_id_computed, 1000));
            //replaceImage(id_value, url_value, event);
            // on ferme la modal
            /*let ele = $(event.target.nodeName).find('a[data-id=id_value]');
            console.log(".length= "+ele.length);
            console.log("html= "+ele.html);
            ele.click();*/
        });

    }

    function upload() {

    }
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
                    <span class="c_zoom"><a href="${obj.list_img[i]}" target="_blank">Zoomer</a></span>
                    <span class="c_delete" data-id="${obj._id}" data-url="${obj.list_img[i]}">Supprimer</span></p>
                    <span class="c_replace" data-id="${obj._id}" data-url="${obj.list_img[i]}" data-index="${i}" data-view-name="${obj.view_name}">Replace</span>
                    <input hidden type="file" id="file_upload${i+obj._id}" name="file" accept="image/png, image/jpeg, image/jpg, image/gif">
                </div>
                <div class="wrapper_image_zoom"><img alt="" width="400" height="300"  src="${obj.list_img[i]}"></div>
                <a name="modal_close" href="#" rel="modal:close" data-id="${obj._id}"></a>
            </div>
       
            <div class="holder ${class_name}">
            <a href="#${i+obj._id}" rel="modal:open">
                <img alt="" src="${obj.list_img[i]}">
            </a>
            </div>
            `;
        }

        return obj_format;
    }

    /******************************************************************************
     *                        Add, Edit, and Delete Actus
     ***************************************************************************** */
    function deleteImage(id_value, url_value, event) {
        console.log("deleteImage called : ID="+id_value+", URL= "+url_value);
        httpPost('/api/image/delete', {"id": id_value, "url":url_value})
            .then(response => response.json())
            .then((response) => {
                if(response.state === "ok") {
                    show_toast("Supprimée avec succès !", "L'image a bien été supprimée", "success");
                    displayImage();
                }
                else {
                    show_toast("Echec de suppresion !", "L'image n'a pas été supprimée", "warning");
                }
                $('a[name=modal_close]').click();
            })
            .catch((error) => {
                show_toast("Erreur de suppresion !", "Veuillez rééssayer plus tard", "error");
            });
    }

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
    function httpPut(path, data) {
        return fetch(path, getOptions('PUT', data));
    }
    function httpDelete(path) {
        return fetch(path, getOptions('DELETE'));
    }

    // Valide une image d'un bon format image
    function validateImage(file_input) {
        // Allowing file type
        let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        /*console.log("file_input.value= "+file_input.value);
        console.log("file_input.files= "+JSON.stringify(file_input.files));
        console.log("file_input.files.name= "+JSON.stringify(file_input.files.name));
        console.log("file_input.files[0]= "+JSON.stringify(file_input.files[0]));
        console.log("file_input.files[0].name= "+file_input.files[0].name);*/

        if (!allowedExtensions.exec(file_input.value)) {
            alert('Type de fichier incorrect');
            file_input.value = '';
            return false;
        }
        else
        {
            /*// Image preview
            if (file_input.files && file_input.files[0]) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById(
                        'imagePreview').innerHTML = '<img id="imgPrevTag" width="200" height="100" src="' + e.target.result + '"/>';
                };

                reader.readAsDataURL(file_input.files[0]);
            }*/
            return true;
        }
    }
    // Vérifie l'en entête binaire d'une image
    function checkHeader(file_input) {
        const blob = file_input.value[i]; // See step 1 above
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
        fileReader.readAsArrayBuffer(blob);
    }
});


// This should work in node.js and other ES5 compliant implementations.
// This should work both there and elsewhere.
function isEmptyObject(obj) {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}


