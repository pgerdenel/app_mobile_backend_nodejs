/**** Jquery UI *******/
$( document ).ready(function() {

    // pre_init();
    $.toast().reset('all');
    // clear input file
    document.getElementById('file_upload').value = '';
    let file_upload = document.getElementById('file_upload');
    //console.log("file_upload.files[0]= " + JSON.stringify(file_upload.files[0]));
    let input_nom_img = document.getElementById('url-img-actu-input');
    input_nom_img.disabled = true;

    // init();
    $("#showe-actu-btn").attr('disabled', true);
    $("#del-actu-btn").attr('disabled', true);
    $("#showe-actu-btn").on( "click", function() {
        let id = $('#id-actu-input').val();
        console.log("id= "+id);
        window.open("/api/actu/one?id="+id, '_blank');
    });
    $("#del-actu-btn").click(function() {
        deleteActu();
    });
    $("#view-actu-btn").click(function() {
        window.open("/api/actu/all", '_blank');
    });
    $("#upload-img-btn").click(function() {
        $("#file_upload").click();
        disable_temp("#upload-img-btn", 1000);
    });
    $("#file_upload").change(function() {
        let file = document.getElementById("file_upload");
        // on vérifie que le fichier de l'utilisateur à mis un fichier
        if(file.value.length !== 0 && validateImage(file)){
            console.log("Ok fichier selectionné et format correcte");
            console.log("file_upload.value= " + file.value);
            console.log("file_upload.files= " + JSON.stringify(file.files));
            console.log("file_upload.files.name= " + JSON.stringify(file.files.name));
            console.log("file_upload.files[0]= " + JSON.stringify(file.files[0]));
            console.log("file_upload.files[0].name= " + file.files[0].name);

            // on affiche le nom de l'image dans l'input
            let input_nom_img = document.getElementById('url-img-actu-input');
            input_nom_img.value = file.files[0].name;
            input_nom_img.disabled = false;
        }
        else {
            console.log("Aucun fichier selectionné ou le format est incorrecte");

        }
    });
    $("#imagePreview").click(function() {
        let div = document.getElementById('imagePreview');
        let myimg = div.getElementsByTagName('img')[0];
        //let myimg = document.getElementsByClassName('imgPrevTag');
        let src = myimg.src;
        console.log("src= "+src);
        window.open(src, '_blank');
    });
    $("#list-actu-btn").click(function() {
        displayActu();
        disable_temp("#list-actu-btn", 1000);
    });
    $("#add-actu-btn").click(function() {
        disable_temp("#add-actu-btn", 1000);

        if (!checkForm(true)) {
            console.log("champ publish incorrectes");
            show_toast("Attention ! ", "Vous tentez d'enregister une actualité incomplète", "warning", false);
            setTimeout(function() {
                    show_toast("Conseil 1", "Assurez vous d'avoir bien renseigné l'extension de votre image si vous en avez joint une (.jpg .jpeg .png .gif)", "info", 8000);
                    setTimeout(function() {
                        show_toast("Conseil 2", "Veuillez vérifier que tous les champs sont bien remplies", "info", 8000);
                    }, 2000);
                }, 2000);
        }
        else {
            console.log("champ publish correctes");
            addActu();
        }
    });
    $("#id-actu-input").on("change", function() {
        console.log("called "+$("#id-actu-input").val());
        let val = $("#id-actu-input").val();
        if(val) {
            console.log("called1 = "+$("#id-actu-input").val());
            $("#showe-actu-btn").attr('disabled', false);
            $("#del-actu-btn").attr('disabled', false);
        }
        else {
            console.log("called2 = "+$("#id-actu-input").val());
            $("#showe-actu-btn").attr('disabled', true);
            $("#del-actu-btn").attr('disabled', true);
        }
    });

    function displayActu() {
        httpGet('/api/actu/all')
            .then(response => response.json())
            .then((response) => {
                show_toast("Actualités listées !", "La liste a été mise à jour", "info");
                console.log("displayActu() called");
                //console.log("response= "+JSON.stringify(response));
                let allActu = response;
                // Empty the anchor
                let allActuAnchor = document.getElementById('all-actu-anchor');
                allActuAnchor.innerHTML = '';
                // Append actu to anchor
                let index = 0;
                let id_plus_index = "";
                let id_minus_index = "";
                let id_show_index = "";
                let id_copy_index = "";

                let id_edit_index = "";
                allActu.forEach((actu) => {
                    index++;
                    id_plus_index = "plus"+index;
                    id_minus_index = "minus"+index;
                    id_show_index = "show"+index;
                    id_copy_index = "copy"+index;
                    allActuAnchor.innerHTML += getActuDisplayEle(actu, index, id_plus_index, id_minus_index, id_show_index, id_copy_index);
                    register_click_listenners_actu(index, id_plus_index, id_minus_index, id_show_index, id_copy_index);
                });
            })
            .catch((error) => {
                //console.error("GetList error= "+error);
                show_toast("Liste indisponible !", "Nous ne pouvons pas récupérer la liste des actualités", "error");
            });
    }
    /******************************************************************************
     *                        Add, Edit, and Delete Actus
     ******************************************************************************/

    function getActuDisplayEle(actu, index, id_plus_index, id_minus_index, id_show_index, id_copy_index) {
        return `<div class="actu-display-ele">

        <div id="normal-view${index}" class="each_actu_view">
            <div id="wrapper_header">
                <span class="title_actu">Actualité N° ${index}</span>
                <span class="actu_entries_option">
                        <span id="${id_plus_index}" class="sign actu_option">&#43;</span>
                        <span id="${id_minus_index}" class="sign actu_option">&#8722;</span>
                        <span id="${id_show_index}" class="sign actu_option" data-actu-id="${actu._id}">⊙</span>
                        <span id="${id_copy_index}" class="sign actu_option" data-actu-id="${actu._id}">&#10063;</span>
                        <!--<div id="btns_actu_entry">
                            <button style="margin-left: 4%;" class="edit-actu-btn${index} small-btn" data-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-actu-id="${actu.id}">Editer</button>
                            <button style="margin-left: 4%;" class="delete-actu-btn${index} small-btn" data-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-actu-id="${actu.id}">Supprimer</button>
                        </div>-->
                </span>
            </div>
            <div class="actu_entries">
                <div class="actu_entry id_info_to_hide"><span class="actu_entry_label">Id</span><span class="actu_entry_data">${actu._id}</span></div>
                <div class="actu_entry"><span class="actu_entry_label">Type</span><span class="actu_entry_data">${actu.type}</span></div>
                <div class="actu_entry"><span class="actu_entry_label">Edifice</span><span class="actu_entry_data">${actu.nom_edifice}</span></div>
                <div hidden id="entries_hidden${index}">
                    <div class="actu_entry"><span class="actu_entry_label"> Code postal         </span><span class="actu_entry_data"> ${actu.cp}</span></div>
                    <div class="actu_entry"><span class="actu_entry_label"> Ville               </span><span class="actu_entry_data"> ${actu.ville}</span></div>
                    <div class="actu_entry"><span class="actu_entry_label"> En-tête             </span><span class="actu_entry_data"> ${actu.head}</span></div>
                    <div class="actu_entry_col"><span class="actu_entry_label_col"> Description :         </span><span class="actu_entry_data_col"> ${actu.content}</span></div>
                    <div class="actu_entry"><span class="actu_entry_label"> Coûts               </span><span class="actu_entry_data"> ${actu.mm}</span></div>
                    <div class="actu_entry"><span class="actu_entry_label"> Durée               </span><span class="actu_entry_data"> ${actu.duree}</span></div>
                    <div class="actu_entry"><span class="actu_entry_label"> Image               </span><span class="actu_entry_data"> <a class="link_entry_data" href="${actu.img}" target="_blank">&#128269;</a></span></div>
                </div>
            </div>
            <!----><div class="btns_actu_entry">
                <button class="edit-actu-btn${index} small-btn" data-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-actu-id="${actu.id}">Editer</button>
                <button class="delete-actu-btn${index} small-btn" data-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-actu-id="${actu.id}">Supprimer</button>
            </div>
        </div>
        
        <div hidden id="edit-view${index}">
            <div class="actu_entry id_info_to_hide" >
                <span hidden class="actu_entry_label" > ID: </span>
                <span class="actu_entry_data"><input type="hidden" name="id" class="id-edit-input" value="${actu._id}" ></span>
            </div>
            <div class="actu_entry">
                <span class="actu_entry_label"> type </span>
                <span class="actu_entry_data"><input required  name="type" minlength="4" maxlength="25" class="type-edit-input input-edit-e" value="${actu.type}" size="20"></span>
            </div>
            <div class="actu_entry">
                <span class="actu_entry_label"> nom </span>
                <span class="actu_entry_data"><input required  name="nom_edifice" inlength="4" maxlength="20" class="nom_edifice-edit-input input-edit-e" value="${actu.nom_edifice}"></span>
            </div>
            <div class="actu_entry">
                <span class="actu_entry_label"> en-tête </span>
                <span class="actu_entry_data"><input required name="head" minlength="0" maxlength="40" class="head-edit-input input-edit-e" value="${actu.head}"></span>
            </div>
            <div class="actu_entry">
                <span class="actu_entry_label"> description </span>
                <span class="actu_entry_data"><input required  name="content" minlength="0" maxlength="80" class="content-edit-input input-edit-e" value="${actu.content}"></span>
            </div>
            <div class="actu_entry">
                <span class="actu_entry_label"> département </span>
                <span class="actu_entry_data"><input required  name="cp" minlength="0" maxlength="5" class="cp-edit-input input-edit-e" value="${actu.cp}"></span>
            </div>
            <div class="actu_entry">
                <span class="actu_entry_label"> ville </span>
                <span class="actu_entry_data"><input required  minlength="0" maxlength="30" name="ville" class="ville-edit-input input-edit-e" value="${actu.ville}"></span>
            </div>
            <div class="actu_entry">
                <span class="actu_entry_label"> financier </span>
                <span class="actu_entry_data"><input required  name="mm" minlength="0" maxlength="25" class="mm-edit-input input-edit-e" value="${actu.mm}"></span>
            </div>
            <div class="actu_entry">
                <span class="actu_entry_label"> durée </span>
                <span class="actu_entry_data"><input required  name="duree" minlength="0" maxlength="15" class="duree-edit-input input-edit-e" value="${actu.duree}"></span>
            </div>
            <div hidden>
                img: <input name="img" class="img-edit-input" value="${actu.img}">
            </div>
            <button class="submit-edit-btn${index} small-btn" data-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-actu-id="${actu._id}">Appliquer</button>
            <button class="cancel-edit-btn${index} small-btn" ata-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-actu-id="${actu._id}">Annuler</button>
        </div>
       
    </div>`;
    }
    function deleteActu(id_ou_pas) {
        console.log("deleteActu called2");
        console.log("l'actu sera supprimé avec l'id= "+(id_ou_pas)?id_ou_pas:document.getElementById('id-actu-input').value);
        httpPost('/api/actu/delete', {"id":(id_ou_pas)?id_ou_pas:document.getElementById('id-actu-input').value})
            .then(response => response.json())
            .then((response) => {

                console.log("response received= "+JSON.stringify(response));
                displayActu();
                if(response.state === "ok") {
                    show_toast("Supprimée avec succcès !", "L'actualité a bien été supprimée", "success");
                }
                else {
                    show_toast("Echec de suppresion !", "L'actualité n'a pas été supprimée", "warning");
                }

            })
            .catch((error) => {
                //console.log("error delete ="+error);
                show_toast("Echec de suppression !", "Nous ne pouvons pas supprimer l'actualité", "error");
            })
    }
    function addActu() {
        let typeInput = document.getElementById('type-actu-input');
        let nomInput = document.getElementById('nom-actu-input');
        let cpInput = document.getElementById('cp-actu-input');
        let villeInput = document.getElementById('ville-actu-input');
        let headInput = document.getElementById('head-actu-input');
        let contentInput = document.getElementById('content-actu-input');
        let mmInput = document.getElementById('mm-actu-input');
        let dureeInput = document.getElementById('duree-actu-input');
        let urlInput = document.getElementById('url-img-actu-input');
        let file_upload = document.getElementById('file_upload');
        /*console.log("urlInput= "+urlInput.value);
        console.log("file_upload= "+file_upload.value.name);*/

        // s'il y a une image on envoie avec un FORMDATA
        if (checkImageNameActuPublish(file_upload.files[0])) {
            console.log("UPLOAD AVEC IMAGE");
            let formdata = new FormData();
            console.log("type= " + typeInput.value);
            console.log("nom= " + nomInput.value);
            console.log("cp= " + cpInput.value);
            console.log("ville= " + villeInput.value);
            console.log("head= " + headInput.value);
            console.log("content= " + contentInput.value);
            console.log("mm= " + mmInput.value);
            console.log("duree= " + dureeInput.value);
            console.log("url= " + urlInput.value);
            formdata.append("type", typeInput.value);
            formdata.append("nom", nomInput.value);
            formdata.append("cp", cpInput.value);
            formdata.append("ville", villeInput.value);
            formdata.append("head", headInput.value);
            formdata.append("content", contentInput.value);
            formdata.append("mm", mmInput.value);
            formdata.append("duree", dureeInput.value);
            formdata.append("url", (urlInput.value) ? urlInput.value : "multer_will_set");
            formdata.append("img", file_upload.files[0], (urlInput.value) ? urlInput.value : file_upload.files[0].name);

            // single
            //let myHeaders = new Headers();
            //myHeaders.append('Access-Control-Request-Method', 'POST');

            let requestOptions = {
                method: 'POST',
                /*headers: myHeaders,*/
                body: formdata
            };
            console.log("envoie de la nouvelle actualité \n");
            for (let value of formdata.values()) {
                console.log(value);
            }

            fetch("/api/actu/createi", requestOptions)
                .then(response => response.json())
                .then((result) => {
                    console.log(result);
                    show_toast("Publiée avec succcès !", "L'actualité à été bien été enregistrée et publiée", "success");
                })
                .catch((error) => {
                    console.log('error', error);
                    show_toast("Echec de publication !", "Nous n'avons pas reussi à enregister et publier l'actualité", "error");
                });
        } else {
            console.log("UPLOAD SANS IMAGE");
            let data = {
                actu: {
                    type: typeInput.value,
                    nom: nomInput.value,
                    cp: cpInput.value,
                    ville: villeInput.value,
                    head: headInput.value,
                    content: contentInput.value,
                    mm: mmInput.value,
                    duree: dureeInput.value,
                    url: "multer_modif"
                }
            };
            console.log("data = " + JSON.stringify(data));
            httpPost('/api/actu/create', data)
                .then(response => response.json())
                .then((result) => {
                    console.log(result);
                    if (result.state === 'ok') {
                        show_toast("Publiée avec succcès !", "L'actualité à été bien été enregistrée et publiée", "success");
                    } else {
                        show_toast("Publication échouée !", "Veuillez rééssayer plus tard", "warning");
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                    show_toast("Echec de publication !", "Nous n'avons pas reussi à enregister et publier l'actualité", "error");
                });
        }
    }

    /* Request */
    function httpGet(path) {
        return fetch(path, getOptions('GET'))
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
    /* @TODO */
    function register_click_listenners_actu(index, id_plus_index, id_minus_index, id_show_index, id_copy_index) {

        setTimeout(function() {

            // on rend plus petit les boutons
            $(".small-btn").css("font-size", "10px");
            $(".small-btn").css("font-weight", "bold");
            $(".id_info_to_hide").css("display", "none");
            //$(".small-btn").css({"color": "#4f69ff"});

            $("#"+id_plus_index).css('cursor', 'pointer');
            $("#"+id_plus_index).on( "click", function() {
                //console.log("id_plus_index clicked");
                $("#entries_hidden"+index).removeAttr('hidden');
                disable_temp("#"+id_plus_index, 1000);
            });
            $("#"+id_minus_index).css('cursor', 'pointer');
            $("#"+id_minus_index).on( "click", function() {
                //console.log("id_minus_index clicked");
                $("#entries_hidden"+index).attr("hidden",true);
                disable_temp("#"+id_minus_index, 1000);
            });
            $("#"+id_show_index).css('cursor', 'pointer');
            $("#"+id_show_index).on( "click", function() {
                //console.log("id_show_index clicked from id= "+"#"+id_show_index);
                $(id_show_index).css("display", "none");
                disable_temp("#"+id_show_index, 1000);
                let id = $("#"+id_show_index).attr("data-actu-id");
                //console.log("id= "+id);
                window.open("/api/actu/one?id="+id, '_blank');
            });
            $("#"+id_copy_index).css('cursor', 'pointer');
            $("#"+id_copy_index).on( "click", function() {
                //console.log("id_show_index clicked from id= "+"#"+id_show_index);
                $(id_show_index).css("display", "none");
                disable_temp("#"+id_show_index, 1000);
                let id = $("#"+id_show_index).attr("data-actu-id");
                $("#id-actu-input").val(id);
                $( "#id-actu-input").trigger( "change");
            });

            $(".delete-actu-btn"+index).on( "click", function() {
                console.log("delete-actu-btn clicked");
                disable_temp(".delete-actu-btn"+index, 1000);
                let editViewLinked = "#"+$(".delete-actu-btn"+index).attr("data-edit-view-linked");
                let idInput =  $(editViewLinked).find('input[name="id"]').val();
                //console.log("val= "+idInput);
                deleteActu(idInput);
                $("#id-actu-input").val("");
            });
            $(".edit-actu-btn"+index).on( "click", function() {
                //console.log("edit-actu-btn clicked");
                disable_temp(".edit-actu-btn"+index, 1000);
                $("#normal-view"+index).css("display", "none");
                $("#edit-view"+index).css("display", "block");
                // on agit sur les inputs d'edition
                $(".input-edit-e").css("font-size", "10px");
                $(".input-edit-e").css("font-weight", "bold");
                /*$(".input-edit-e").css("color", "red");*/
            });
            $(".cancel-edit-btn"+index).on( "click", function() {
                //console.log("cancel-edit-btn clicked");
                disable_temp(".cancel-edit-btn"+index, 1000);
                $("#normal-view"+index).css("display", "block");
                $("#edit-view"+index).css("display", "none");
            });
            $(".submit-edit-btn"+index).on( "click", function() {
                disable_temp(".submit-edit-btn"+index, 2000);

                let editViewLinked = "#"+$(".submit-edit-btn"+index).attr("data-edit-view-linked");

                /**/let idInput =           $(editViewLinked).find('input[name="id"]').val();
                let typeInput =         $(editViewLinked).find('input[name="type"]').val();
                let nom_edificeInput =  $(editViewLinked).find('input[name="nom_edifice"]').val();
                let cpInput =           $(editViewLinked).find('input[name="cp"]').val();
                let villeInput =        $(editViewLinked).find('input[name="ville"]').val();
                let headInput =         $(editViewLinked).find('input[name="head"]').val();
                let contentInput =      $(editViewLinked).find('input[name="content"]').val();
                let mmInput =           $(editViewLinked).find('input[name="mm"]').val();
                let dureeInput =        $(editViewLinked).find('input[name="duree"]').val();
                let imgInput =          $(editViewLinked).find('input[name="img"]').val();

                if(checkForm(false, editViewLinked)/*typeInput.is(':valid') && nom_edificeInput.is(':valid') && cpInput.is(':valid') && villeInput.is(':valid') && headInput.is(':valid') && contentInput.is(':valid') && mmInput.is(':valid') && dureeInput.is(':valid') && imgInput.is(':valid')*/) {
                    let data = {
                        actu: {
                            id: idInput,
                            type: typeInput,
                            nom_edifice: nom_edificeInput,
                            cp: cpInput,
                            ville: villeInput,
                            head: headInput,
                            content: contentInput,
                            mm: mmInput,
                            duree: dureeInput,
                            img: imgInput,
                        }
                    };
                    console.log("data = " + JSON.stringify(data));
                    httpPost('/api/actu/update', data)
                        .then(response => response.json())
                        .then((result) => {
                            console.log("response update= " + JSON.stringify(result));

                            if (result.state === 'ok') {
                                show_toast("Mise à jour avec succcès !", "L'actualité à été bien été mise à jour", "success");
                                displayActu();
                            } else {
                                show_toast("Mise à jour échouée !", "Veuillez rééssayer plus tard", "warning");
                            }
                        })
                        .catch((error) => {
                            console.log('error', error);
                            show_toast("Echec de la mise à jour !", "Nous n'avons pas reussi à mettre à jour l'actualité", "error");
                        });
                }
                else {
                    show_toast("Attention !", "Vous essayez de mettre à jour une actualité avec des informations incomplètes", "warning", 5000);
                }
            });
        }, 1000);
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
            // Image preview
            if (file_input.files && file_input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById(
                        'imagePreview').innerHTML = '<img id="imgPrevTag" width="200" height="100" src="' + e.target.result + '"/>';
                };

                reader.readAsDataURL(file_input.files[0]);
            }
            return true;
        }
    }
    // Vérifie l'en entête binaire d'une image

    /* Vérifie les champs de base du formulaire de publication d'une actualité ou celles d'edition */
    function checkForm(isPublishForm, editViewLinked) {
        let id=$("");

        /* edit form
        let idInput =           $(editViewLinked).find('input[name="id"]');
        let typeInput =         $(editViewLinked).find('input[name="type"]');
        let nom_edificeInput =  $(editViewLinked).find('input[name="nom_edifice"]');
        let cpInput =           $(editViewLinked).find('input[name="cp"]');
        let villeInput =        $(editViewLinked).find('input[name="ville"]');
        let headInput =         $(editViewLinked).find('input[name="head"]');
        let contentInput =      $(editViewLinked).find('input[name="content"]');
        let mmInput =           $(editViewLinked).find('input[name="mm"]');
        let dureeInput =        $(editViewLinked).find('input[name="duree"]');
        let imgInput =          $(editViewLinked).find('input[name="img"]');
        */
        console.log("chekform called isPublishForm= " + isPublishForm);
        if (isPublishForm === true) {
            let typeInput=$("#type-actu-input");
            let nom_edificeInput=$("#nom-actu-input");
            let cpInput=$("#cp-actu-input");
            let villeInput=$("#ville-actu-input");
            let headInput=$("#head-actu-input");
            let contentInput=$("#content-actu-input");
            let mmInput=$("#mm-actu-input");
            let dureeInput=$("#duree-actu-input");

            console.log("check_length(typeInput.val(), 4, 25)= " + check_length(typeInput.val(), 4, 25));
            console.log("check_length(nom_edificeInput.val(), 4, 20)= " + check_length(nom_edificeInput.val(), 4, 30));
            console.log("check_length(cpInput.val(), 3, 5)= " + check_length(cpInput.val(), 3, 20));
            console.log("check_length(villeInput.val(), 3, 30)= " + check_length(villeInput.val(), 3, 30));
            console.log("check_length(headInput.val(), 3, 80)" + check_length(headInput.val(), 3, 50));
            console.log("check_length(contentInput.val(), 4, 25) " + check_length(contentInput.val(), 4, 170));
            console.log("check_length(mmInput.val(), 4, 25) " + check_length(mmInput.val(), 4, 25));
            console.log("check_length(dureeInput.val(), 4, 25) " + check_length(dureeInput.val(), 4, 25));

            let bool_type = check_length(typeInput.val(), 4, 25);
            let bool_nom = check_length(nom_edificeInput.val(), 4, 20);
            let bool_cp = check_length(cpInput.val(), 3, 20);
            let bool_ville = check_length(villeInput.val(), 3, 30);
            let bool_head = check_length(headInput.val(), 3, 50);
            let bool_content = check_length(contentInput.val(), 4, 170);
            let bool_mm = check_length(mmInput.val(), 4, 25);
            let bool_duree = check_length(dureeInput.val(), 4, 25);

            /*if (bool_type) {typeInput.addClass("valid_field")}
            else {typeInput.addClass("invalid_field");}

            if (bool_nom) {nom_edificeInput.addClass("valid_field");}
            else {nom_edificeInput.addClass("invalid_field");}

            if (bool_cp) {cpInput.addClass("valid_field");}
            else {cpInput.addClass("invalid_field");}

            if (bool_ville) {villeInput.addClass("valid_field")}
            else {villeInput.addClass("invalid_field");}

            if (bool_head) {headInput.addClass("valid_field");}
            else {headInput.addClass("invalid_field");}

            if (bool_content) {contentInput.addClass("valid_field");}
            else {contentInput.addClass("invalid_field");}

            if (bool_mm) {mmInput.addClass("valid_field");}
            else {mmInput.addClass("invalid_field");}

            if (bool_duree) {dureeInput.addClass("valid_field");}
            else {dureeInput.addClass("invalid_field");}*/

            let bool_final = bool_type && bool_nom && bool_cp && bool_ville && bool_head && bool_content && bool_mm && bool_duree;
            console.log("boot_fiona= "+bool_final);
            /*
            return (check_length(typeInput.val(), 4, 25)
                && check_length(nom_edificeInput.val(), 4, 20)
                && check_length(cpInput.val(), 3, 5)
                && check_length(villeInput.val(), 3, 30)
                && check_length(headInput.val(), 3, 80)
                && check_length(contentInput.val(), 4, 25)
                && check_length(mmInput.val(), 4, 25)
                && check_length(dureeInput.val(), 4, 25));
             */
            if(bool_type && bool_nom && bool_cp && bool_ville && bool_head && bool_content && bool_mm && bool_duree) {
                console.log("champ correct !");
                return true;
            }
            else {
                console.log("champs incorrects !");
                return false;
            }
        }
        else
        {
            return (
                check_length($(editViewLinked).find('input[name="type"]').val(), 4, 25)
                && check_length($(editViewLinked).find('input[name="nom_edifice"]').val(), 4, 30)
                && check_length($(editViewLinked).find('input[name="cp"]').val(), 3, 20)
                && check_length($(editViewLinked).find('input[name="ville"]').val(), 3, 30)
                && check_length($(editViewLinked).find('input[name="head"]').val(), 4, 50)
                && check_length($(editViewLinked).find('input[name="content"]').val(), 4, 170)
                && check_length($(editViewLinked).find('input[name="mm"]').val(), 4, 25)
                && check_length($(editViewLinked).find('input[name="duree"]').val(), 4, 25)
            );
        }
    }

    function checkImageNameActuPublish(file_upload_file_array0) {
        let val_url_img_input  = document.getElementById('url-img-actu-input').value;
        // si une image est définie
        if(file_upload.files[0]) {
            return (val_url_img_input.includes(".png") || val_url_img_input.includes(".jpg") || val_url_img_input.includes(".jpeg") || val_url_img_input.includes(".gif"))
        }
    }
});




