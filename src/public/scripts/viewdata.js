$( document ).ready(function() {

    let hasStarted = false;
    let view_selected = 'home';
    pre_init();
    init();
    set_home_job();

    // Pré initialisation des données de la vu
    function pre_init() {
        // clear input file
        document.getElementById('file_upload').value = '';
        let file_upload = document.getElementById('file_upload');
        console.log("file_upload.files[0]= " + JSON.stringify(file_upload.files[0]));
        $("#type-viewdata-select").val('home')
    }
    // Initialise les données de la vue générales
    function init() {
        $("#show-all-view").on("click", function() {
            disable_temp("#show-all-view", 1000);
            window.open("/api/view/all", '_blank');
        });
        $("#upload-img-btn").click(function() {
            disable_temp("#upload-img-btn", 1000);
            $("#file_upload").click();
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
                let input_nom_img = document.getElementById('url-img-vd-input');
                input_nom_img.value = file.files[0].name;
            }
            else {
                console.log("Aucun fichier selectionné ou le format est incorrecte");
            }
        });
        $("#imagePreview").click(function() {
            disable_temp("#imagePreview", 1000);
            let div = document.getElementById('imagePreview');
            let myimg = div.getElementsByTagName('img')[0];
            //let myimg = document.getElementsByClassName('imgPrevTag');
            let src = myimg.src;
            console.log("src= "+src);
            window.open(src, '_blank');
        });
        $("#type-viewdata-select").on("change", function() {
            disable_temp("#type-viewdata-select", 300);
            let value = $("#type-viewdata-select").val();
            console.log("select value changed= "+value);
            switch(value) {
                case "home":
                    set_home_job();
                    break;
                case "prez":
                    set_prez_job();
                    break;
                case "svc":
                    set_svc_job();
                    break;
            }
        });
        $("#update-label-btn").on("click", function() {
            disable_temp("#update-label-btn", 1000);
            // on récupère le type du select
            let value = $("#type-viewdata-select").val();
            switch(value) {
                case "home" :
                    let taille = $("#text-area").val().length;
                    console.log("length= "+taille);
                    // on vérifie que le text area n'est pas vide
                    if(taille > 0) {
                        updateViewData_Home($("#text-area").val());
                    }
                    else  {
                        alert("Vous devez changer la phrase d'acceuil pour la mettre à jour ");
                    }
                    break;
                case "prez" :
                    let label = $("#select-label").val();
                    let size_input_label_name = $("#input-label-name").val().length;
                    let size_text_area_label_data = $("#text-area").val().length;
                    console.log("size_input_label_name= "+size_input_label_name);
                    console.log("size_text_area_label_data= "+size_text_area_label_data);
                    // on vérifie que le text area n'est pas vide
                    if(size_input_label_name > 0 && size_text_area_label_data>0) {
                        //console.log("view prez called with id= "+$("#select-label").val()+"\nlabel_name="+$("#input-label-name").val()+"\nlabel_data= "+$("#text-area").val());
                        updateViewData_Prez($("#select-label").val(), $("#input-label-name").val(), $("#text-area").val() );
                    }
                    else  {
                        alert("Vous devez insérer des données avant de mettre à jour");
                    }
                    break;
                case "svc" :
                    let label_svc = $("#select-label").val();
                    let size_input_label_name_svc = $("#input-label-name").val().length;
                    let size_text_area_label_data_svc = $("#text-area").val().length;
                    console.log("size_input_label_name_svc= "+size_input_label_name_svc);
                    console.log("size_text_area_label_data_svc= "+size_text_area_label_data_svc);
                    // on vérifie que le text area n'est pas vide
                    if(size_input_label_name_svc > 0 && size_text_area_label_data_svc>0) {
                        //console.log("view prez called with id= "+$("#select-label").val()+"\nlabel_name="+$("#input-label-name").val()+"\nlabel_data= "+$("#text-area").val());
                        updateViewData_Svc($("#select-label").val(), $("#input-label-name").val(), $("#text-area").val() );
                    }
                    else  {
                        alert("Vous devez insérer des données avant de mettre à jour");
                    }
                    break;
            }
        }); // event sur le bouton "Mettre à jour"
    }

    // Initialise les donnée de la vue avec les données de traitement HOME
    function set_home_job() {
        console.log("set_home() called");
        view_selected = 'home';

        $("#type-viewdata-select").val('home'); // select value sur home
        $("#p-home-label").css("display", "block"); // paragraphe d'édition de l'acceuil
        $("#select-label").css("display", "none"); // pas de select de label
        $("#input-label-name").css("display", "none"); // pas d'input pour édition de label
        $("#show-all-view").css("display", "none"); // pas de bouton voir tout

        getDataHome(); // text area avec valeur des données du label home
    }

    /* PREZ */
    // Initialise les donnée de la vue avec les données de traitement PREZ
    function set_prez_job() {
        console.log("set_prez() called");
        view_selected = 'prez';

        $("#input-label-name").val(''); // on clear l'input
        $("#type-viewdata-select").val('prez'); // select value sur prez
        $("#select-label").css("display", "block"); // select des label de la vue

        $("#input-label-name").css("display", "block"); // input pour édition de label
        $("#show-all-view").css("display", "block"); // bouton voir tout
        $("#p-home-label").css("display", "none"); // paragraphe d'édition de l'acceuil

        $("#text-area").val("");

        displayLabelPrez();// select doit avoir les labels de prez et les données du label dans le text area


    }

    /* SVC */
    // Initialise les donnée de la vue avec les données de traitement SVC
    function set_svc_job() {
        console.log("set_svc() called");
        view_selected = 'svc';

        $("#type-viewdata-select").val('svc'); // select value sur svc
        $("#select-label").css("display", "block"); // select des label de la vue

        $("#input-label-name").css("display", "block"); // input pour édition de label
        $("#show-all-view").css("display", "block"); // bouton voir tout
        $("#p-home-label").css("display", "none"); // paragraphe d'édition de l'acceuil

        $("#text-area").val("");

        displayLabelSvc();// select doit avoir les labels de prez et les données du label dans le text area

    }

    /* Met à jour la phrase d'acceuil avec la nouvelle */
    function updateViewData_Home(phrase_home) {
        let data = {phrase: phrase_home,};
        httpPost('/api/view/home/update_data', data)
            .then(response => response.json())
            .then((response) => {
                console.log("updateViewData_Home response = "+JSON.stringify(response));
                if(response.state === "ok") {
                    show_toast("Succès de la mise à jour ", "La phrase d'acceuil a bien été mise à jour", "success", 5000);
                    set_home_job();
                }
                else {
                    show_toast("Echec de la mise à jour ", "La phrase d'acceuil n'a pas été mise à jour", "warning", false);
                }
            })
            .catch((error) => {
                console.log('error updateViewData_Home= ', error);
                show_toast("Erreur de mise à jour ", "Veuillez réésayer plus tard", "error", false);
            })
            .finally( () => {
                //set_home_job()
            });
    }
    /* Met à jour le label d'une entrée prez et ses données */
    function updateViewData_Prez(id_label, val_label, val_label_data){
        let data = {
            id: id_label,
            label_name:val_label,
            label_data:val_label_data
        };
        console.log("updateViewData_Prez data sent= "+JSON.stringify(data));
        httpPost('/api/view/prez/update_data', data)
            .then(response => response.json())
            .then((response) => {
                console.log("updateViewData_Prez response = "+JSON.stringify(response));
                if(response.state === "ok") {
                    show_toast("Succès de la mise à jour ", "La page présentation a bien été mise à jour", "success", 5000);
                    set_prez_job()
                }
                else {
                    show_toast("Echec de la mise à jour ", "La page présentation n'a pas été mise à jour", "warning", false);
                }

            })
            .catch( (error) =>  {
                console.log('error updateViewData_Prez= ', error);
                show_toast("Erreur de mise à jour ", "Veuillez réésayer plus tard", "error", false);
            })
            .finally( () => {
                //set_prez_job()
            });
    }
    /* Met à jour le label d'une entrée svc et ses données */
    function updateViewData_Svc(id_label, val_label, val_label_data){
        let data = {
            id: id_label,
            label_name:val_label,
            label_data:val_label_data
        };
        console.log("updateViewData_Svc data sent= "+JSON.stringify(data));
        httpPost('/api/view/svc/update_data', data)
            .then(response => response.json())
            .then((response) => {
                console.log("updateViewData_Svc response = "+JSON.stringify(response));
                if(response.state === "ok") {
                    show_toast("Succès de la mise à jour ", "La page service a bien été mise à jour", "success", 5000);
                    set_svc_job()
                }
                else {
                    show_toast("Echec de la mise à jour ", "La page service n'a pas été mise à jour", "warning", false);
                }
            })
            .catch((error) => {
                console.log('error updateViewData_Svc= ', error);
                show_toast("Erreur de mise à jour ", "Veuillez réésayer plus tard", "error", false);
            })
            .finally( () => {
                    //set_svc_job()
            });
    }
    /* HOME */
    function getDataHome() {
        return httpGet("/api/view/home/data")
            .then(response => response.json())
            .then((response) => {
                console.log("data_home = " + JSON.stringify(response[0].label_data));
                console.log("getDataHome ok");
                //show_toast("Succès de la mise à jour ", "La page service a bien été mise à jour", "success", 5000);
                $("#text-area").val(response[0].label_data);
            })
            .catch((error) => {
                console.log('error getDataHome= ', error);
                //show_toast("Erreur de mise à jour ", "Veuillez réésayer plus tard", "error", false);
            })
    }
    /* PREZ */
    function displayLabelPrez() {
        return httpGet("/api/view/prez/all_data")
            .then(response => response.json())
            .then((response) => {
                let all_label_and_data = response;
                //console.log("data_home = "+JSON.stringify(response));
                let index = 0;
                $("#select-label").find('option').remove().end();
                all_label_and_data.forEach((label_and_data) => {
                    if(index === 0 && !hasStarted) {
                        let option = "<option selected value="+label_and_data._id+">"+label_and_data.label_name+"</option>";
                        $("#select-label").append(option);
                        $("#input-label-name").val(label_and_data.label_name);
                        $("#text-area").val(label_and_data.label_data);
                        hasStarted = true;
                    }
                    else {
                        let option = "<option value="+label_and_data._id+">"+label_and_data.label_name+"</option>";
                        $("#select-label").append(option);
                    }
                    index++;
                });
                $( "#select-label" ).trigger( "change" );
                $("#select-label").on("change", function() {
                    disable_temp("#select-label", 300);
                    console.log("new value= "+ $("#select-label").val());
                    console.log("new value text = "+$("#select-label").text());
                    $("#input-label-name").val('');
                    let id = $("#select-label").val();
                    let text = $("#select-label").find(":selected").text();
                    getLabelAndDataOfIDPrez(id,text);
                });
            })

    }
    function getLabelAndDataOfIDPrez(id, text) {
        return httpGet("/api/view/prez/data?id="+id)
            .then(response => response.json())
            .then((response) => {
                //console.log("getLabelAndDataOfIDPrez data = "+JSON.stringify(response));
                console.log("getLabelAndDataOfIDPrez function param terxt = "+text);
                let data_label = response;
                $("#input-label-name").val('');
                $("#input-label-name").val(text);
                $("#text-area").val('').val(data_label[0].label_data);
            })
    }
    /* SVC */
    function displayLabelSvc() {
        return httpGet("/api/view/svc/all_data")
            .then(response => response.json())
            .then((response) => {
                let all_label_and_data = response;
                //console.log("data_svc = "+JSON.stringify(response));
                let index = 0;
                $("#select-label").find('option').remove().end();
                all_label_and_data.forEach((label_and_data) => {
                    if(index === 0 && !hasStarted) {
                        let option = "<option selected value="+label_and_data._id+">"+label_and_data.label_name+"</option>";
                        $("#select-label").append(option);
                        $("#input-label-name").val(label_and_data.label_name);
                        $("#text-area").val(label_and_data.label_data);
                        hasStarted = true;
                    }
                    else {
                        let option = "<option value="+label_and_data._id+">"+label_and_data.label_name+"</option>";
                        $("#select-label").append(option);
                    }
                    index++;
                });
                $( "#select-label" ).trigger( "change" );
                $("#select-label").on("change", function() {
                    disable_temp("#select-label", 300);
                    console.log("new value= "+ $("#select-label").val());
                    console.log("new value text = "+$("#select-label").text());
                    $("#input-label-name").val('');
                    let id = $("#select-label").val();
                    let text = $("#select-label").find(":selected").text();
                    getLabelAndDataOfIDSvc(id,text);
                });
            })

    }
    function getLabelAndDataOfIDSvc(id, text) {
        return httpGet("/api/view/svc/data?id="+id)
            .then(response => response.json())
            .then((response) => {
                console.log("getLabelAndDataOfIDSvc data = "+JSON.stringify(response));
                console.log("getLabelAndDataOfIDSvc function param terxt = "+text);
                let data_label = response;
                $("#input-label-name").val('');
                $("#input-label-name").val(text);
                $("#text-area").val('').val(data_label[0].label_data);
            })
    }

    /* GENERAL HTTP CALL */
    function httpPost(path, data) {
        return fetch(path, getOptions('POST', data));
    }
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


