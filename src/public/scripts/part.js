/**** Jquery UI *******/
$(document).ready(function() {

    let toast_list_success;

    console.log("selected = "+$("#type-part-select").val());
    $("#list-part-btn").on( "click", function() {
        disable_temp("#list-part-btn", 1000);
        displayPart();
    });
    $("#add-part-btn").on( "click", function() {
        disable_temp("#add-part-btn", 1000);
        if($("#type-part-select").val() && $("#nom-part-input").val()) {
            addPart();
        }
        else {
            show_toast("Attention !", "Le partenaire n'a pas de nom", "warning");
        }
    });

    /******************************************************************************
     *                          Fetch and display partenaire
     ******************************************************************************/
    function displayPart() {
        httpGet('/api/part/all')
            .then(response => response.json())
            .then((response) => {
                //toast_list_success.reset();
                if(toast_list_success) toast_list_success.reset();
                toast_list_success = show_toast("Partenaires listés !", "La liste a été mise à jour", "info", 1000);

                    //console.log("response= "+JSON.stringify(response));
                    let allPart = response;
                    // Empty the anchor
                    let allPartAnchor = document.getElementById('all-part-anchor');
                    allPartAnchor.innerHTML = '';

                    let index = 0;
                    // Append part to anchor
                    allPart.forEach((part) => {
                        index++;
                        allPartAnchor.innerHTML += getPartDisplayEle(part, index);
                        register_click_listenners_part(index);
                    });
            })
            .catch((error) => {
                show_toast("Liste indisponible !", "Nous ne pouvons pas récupérer la liste des partenaires", "error", false);
            });
    }

    /******************************************************************************
     *                        Add, Edit, and Delete partenaires
     ******************************************************************************/
    function getPartDisplayEle(part, index) {
        console.log("getPartDisplayEle index="+index);
        return `<div class="part-display-ele">
    
            <div id="normal-view${index}">
                <div class="wrapper_entries">
                    <div hidden>_id: ${part._id}</div>
                    <div class="entry">   <span class="title_entry">type</span>   <span class="data_entry">${(part.type==="col")?"Collectivité":"Particulier"}</span></div>
                    <div class="entry">   <span class="title_entry">nom</span>    <span class="data_entry" style="font-style: italic;">${part.nom}</span></div>
                </div>
                <div class="btns_action">
                    <button class="edit-part-btn${index} small-btn" data-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-part-id="${part._id}">Editer</button>
                    <button class="delete-part-btn${index} small-btn" data-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-part-id="${part._id}">Supprimer</button>
                </div>
            </div>
            
            <div hidden id="edit-view${index}">
                <div hidden>
                    ID: <input name="id" type="hidden" class="id-edit-input" value="${part._id}">
                </div>
                <div hidden >
                    type: <input name="type-part" class="type-edit-input" value="${part.type}">
                </div>
                <div class="edit_input_wrapper">
                    <span style="margin-right:5% ">nom: </span><input name="nom-part" class="nom-edit-input" value="${part.nom}">
                </div>
                <button class="submit-edit-btn${index} small-btn" data-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-part-id="${part._id}">Appliquer</button>
                <button class="cancel-edit-btn${index} small-btn" data-edit-view-linked="edit-view${index}" data-normal-view-linked="normal-view${index}" data-part-id="${part._id}">Annuler</button>
            </div>
           
        </div>`;
    }
    function submitEdit(ele) {
        const partEle = ele.parentNode.parentNode;
        const idInput = partEle.getElementsByClassName('id-edit-input')[0];
        const typeInput = partEle.getElementsByClassName('type-edit-input')[0];
        const nomInput = partEle.getElementsByClassName('nom-edit-input')[0];
        const data = {
            part: {
                id: idInput.value,
                type: typeInput.value,
                nom: nomInput.value,
            }
        };
        httpPost('/api/part/update', data)
            .then(response => response.json())
            .then((response) => {
                if(response.state === "ok") {
                    show_toast("Succès de la mise à jour !", "Les informations du partenaire ont bien été mise à jour", "success");
                    displayPart();
                }
                else {
                    show_toast("Echec de la mise à jour !", "Les informations du partenaire n'ont pas été mise à jour", "warning", false);
                }

            })
            .catch((error) => {
                show_toast("Erreur de la mise à jour !", "Veuillez rééssayer plus tard", "error", false);
            })
    }
    function deletePart(id) {
        console.log("deletePart called");
        httpPost('/api/part/delete', {"id":id})
            .then(response => response.json())
            .then((response) => {
                if(response.state === "ok") {
                    show_toast("Supprimé avec succès !", "Le partenaire a bien été supprimé", "success");
                }
                else {
                    show_toast("Echec de suppression !", "Le partenaire n'a pas été supprimé", "warning", false);
                }
            })
            .catch((error) => {
                show_toast("Erreur de suppression !", "Veuillez réésayer plus tard", "error", false);
            })
    }
    function addPart() {
        const typeInput = document.getElementById('type-part-input');

        const data = {
            part: {
                type: $("#type-part-select").val(),
                nom: $("#nom-part-input").val(),
            },
        };
        console.log("data rest");

        // on vérifie si le partenaire existe
        httpPost('/api/part/exist', data)
            .then(response => response.json())
            .then((response) => {
                console.log("response exist = "+JSON.stringify(response));
                if(response.state === "ok") {
                    console.log("response exist = "+JSON.stringify(response));
                    httpPost('/api/part/create', data)
                        .then(response => response.json())
                        .then((response) => {
                            if(response.state === "ok") {
                                show_toast("Crée avec succès !", "Le partenaire a bien été enregistré", "success");
                                displayPart();
                            }
                            else {
                                show_toast("Echec de création !", "Le nouveau partenaire n'a pas pu être enregistré", "warning", false);
                            }
                        })
                        .catch((error) => {
                            show_toast("Erreur de création !", "Veuillez réésayer plus tard", "error", false);
                        })
                }
                else {
                    show_toast("Attention !", "Le partenaire existe déjà avec ce nom", "warning", false);
                }
            })
            .catch((error) => {
                console.log("error response exist = "+JSON.stringify(error));
                //show_toast("Erreur de création !", "Veuillez réésayer plus tard", "error", false);
            });


    }

    function httpGet(path) {
        return fetch(path, getOptions('GET'))
    }
    function httpPost(path, data) {
        return fetch(path, getOptions('POST', data));
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

    function register_click_listenners_part(index) {

        console.log("register_click_listenners_part called id="+index);

        setTimeout(function() {

            $(".small-btn").css("font-size", "10px");
            $(".small-btn").css("margin-bottom", "3%");
            $(".small-btn").css("font-weight", "bold");
            $(".small-btn").css("color", "bold");
            $(".data_entry").css("width", "150%");

            $(".delete-part-btn"+index).on( "click", function() {
                disable_temp(".delete-part-btn"+index, 1000);
                //console.log("delete-part-btn clicked");
                let editViewLinked = "#"+$(".delete-part-btn"+index).attr("data-edit-view-linked");
                let idInput =  $(editViewLinked).find('input[name="id"]').val();
                //console.log("val= "+idInput);
                deletePart(idInput);
            });
            $(".edit-part-btn"+index).on( "click", function() {
                disable_temp(".edit-part-btn"+index, 1000);
                //console.log("edit-part-btn clicked");
                $("#normal-view"+index).css("display", "none");
                $("#edit-view"+index).css("display", "block");
            });
            $(".cancel-edit-btn"+index).on( "click", function() {
                disable_temp(".cancel-edit-btn"+index, 1000);
                //console.log("cancel-edit-btn clicked");
                $("#normal-view"+index).css("display", "block");
                $("#edit-view"+index).css("display", "none");
            });
            $(".submit-edit-btn"+index).on( "click", function() {

                disable_temp(".submit-edit-btn"+index, 1000);
                let editViewLinked = "#"+$(".submit-edit-btn"+index).attr("data-edit-view-linked");

                let idInput =           $(editViewLinked).find('input[name="id"]').val();
                let typeInput =         $(editViewLinked).find('input[name="type-part"]').val();
                let name_partInput =  $(editViewLinked).find('input[name="nom-part"]').val();

                let data = {
                    part: {
                        id: idInput,
                        type: typeInput,
                        nom: name_partInput,
                    }
                };
                console.log("data = "+JSON.stringify(data));
                httpPost('/api/part/update', data)
                    .then(response => response.json())
                    .then((response) => {
                        if(response.state === "ok") {
                            console.log("response = "+JSON.stringify(response));
                            show_toast("Mis à jour avec succès !", "Les données du partenaire ont bien été mise à jour", "success");
                            displayPart();
                        }
                        else {
                            show_toast("Echec de mise à jour !", "Le partenaire n'a pas pu être mis à jour", "warning", false);
                        }
                    })
                    .catch((error) => {
                        show_toast("Erreur de mise à jour !", "Les données du partenaires n'ont pas pu être mise à jour", "error", false);
                    })
            });
        }, 1000);

    }

});




