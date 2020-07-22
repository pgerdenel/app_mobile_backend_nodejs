/******************************************************************************
 *                          Fetch and display actus
 ******************************************************************************/

function displayContact() {
    httpGet('/api/contact/all')
        .then(response => response.json())
        .then((response) => {
            //console.log("response= "+JSON.stringify(response));
            show_toast("Liste disponible !", "Liste de message mise à jour", "info");
            let allContact = response;
            // Empty the anchor
            let allContactAnchor = document.getElementById('all-contact-anchor');
            allContactAnchor.innerHTML = '';
            // Append actu to anchor
            let index=0;
            allContact.forEach((contact) => {
                index++;
                allContactAnchor.innerHTML += getContactDisplayEle(contact, index);
            });
            // on rend plus petit les boutons
            $(".small-btn").css("font-size", "10px");
            $(".small-btn").css("font-weight", "bold");
        })
        .catch((error) => {
            show_toast("Liste de messages indisponibles !", "Veuillez rééssayer plus tard", "error");
        });
}

document.addEventListener('click', function (event) {
    event.preventDefault();
    let ele = event.target;
    if (ele.matches('#list-contact-btn')) {
        displayContact();
    } else if (ele.matches('#del-contact-btn')) {
        deleteContact();
    } else if (ele.matches('.delete-contact-btn')) {
        deleteContact(ele);
    }
}, false);


function getContactDisplayEle(contact, index) {
    return `<div class="contact-display-ele">
        
        <div class="normal-view">
            <span class="titre_entry">Message N°${index}</span>
            <div hidden>_id: ${contact._id}</div>
            <div class="entry"><span class="title_entry">Email: </span>                 <span class="data_entry_email"><a href="mailto:${contact.email}">${contact.email}</a></div>
            <div class="entry"><span class="title_entry">Sujet: </span>                 <span class="data_entry_sujet">${contact.sujet}</div>
            <div class="entry entry_email"><span class="title_entry">Message: </span>   <span class="data_entry_message">${contact.message}</span></div>
            <button class="delete-contact-btn small-btn" data-actu-id="${contact._id}">Supprimer</button>
        </div>
    </div>`;
}


/******************************************************************************
 *                        Add, Edit, and Delete Actus
 ***************************************************************************** */
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

function deleteContact(ele) {
    console.log("deleteContact called");
    let rid = ele.getAttribute('data-actu-id');
    console.log("id ele data="+rid.value);
    const id = document.getElementById('id-contact-input');
    httpPost('/api/contact/delete', {"id":rid})
        .then(response => response.json())
        .then((response) => {
            if(response.state === "ok") {
                show_toast("Supprimé avec succcès !", "Le message a bien été supprimé", "success");
                displayContact();
            }
            else {
                show_toast("Echec de suppression !", "Le message n'a pas été supprimé", "warning");
            }
        })
        .catch((error) => {
            show_toast("Erreur de suppression !", "Veuillez rééssayer plus tard", "error");
        });
}

function httpPost(path, data) {
    return fetch(path, getOptions('POST', data));
}


