const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
let selectedIcon = "fa-file-lines";

// --- DONNÉES DE DÉPART ---
let docTypes = [];
let modelsData = [];
let currentCategoryId = null;

// --- FONCTIONS AJAX ---
function getCategory() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './backend/php/getAllCategory.php', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const categories = JSON.parse(xhr.responseText);
                docTypes = categories.map(cat => ({
                    id: cat.id,
                    titre: cat.titre,
                    desc: cat.description,
                    details: cat.details_doc || cat.description,
                    icon: cat.icon || 'fa-file-lines',
                    isMulti: cat.is_multi == 1,
                    url: cat.url_direct || ""
                }));
                renderGrids();
            } catch (e) {
                console.error("Erreur JSON:", e);
            }
        }
    };
    xhr.send();
}

function getModele(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './backend/php/getAllModele.php', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const modeles = JSON.parse(xhr.responseText);
                modelsData = modeles.map(m => ({
                    id: m.id,
                    category_id: m.category_id,
                    titre: m.titre,
                    desc: m.description,
                    details: m.details_mod || m.description,
                    icon: m.icon || 'fa-award',
                    url: m.file_path
                }));
                if (callback) callback();
                renderGrids(); 
            } catch(e) {
                console.error("Erreur JSON :", e);
            }
        }
    };
    xhr.send();
}

// --- MODALE INFOS ---
function showDetails(titre, details) {
    modalContent.innerHTML = `
        <div style="border-bottom: 2px solid var(--poly-gold); padding-bottom: 10px; margin-bottom: 15px;">
            <h2 style="margin: 0; color: var(--poly-blue);">${titre}</h2>
        </div>
        <div class="modal-details-content">
            ${details ? details : "Aucune information supplémentaire."}
        </div>
        <div class="modal-btns" style="margin-top: 25px;">
            <button onclick="closeModal()" class="btn-main" style="width: 100%;">Fermer</button>
        </div>
    `;
    modal.style.display = 'flex';
}

// --- NAVIGATION ---
function slideToModels(categoryId, categoryTitle) {
    currentCategoryId = categoryId;
    const filteredModels = modelsData.filter(m => m.category_id == categoryId);
    document.getElementById('pageTitle').innerText = categoryTitle;
    document.getElementById('pageSubtitle').innerText = `${filteredModels.length} modèles disponibles`;
    document.getElementById('modelGrid').innerHTML = filteredModels.map(model => `
        <div class="card">
            <i class="fa-solid fa-circle-info btn-info" onclick="showDetails('${model.titre.replace(/'/g, "\\'")}', '${model.details ? model.details.replace(/'/g, "\\'").replace(/\n/g, "<br>") : ""}')"></i>
            <div class="icon-box"><i class="fa-solid ${model.icon}"></i></div>
            <h3>${model.titre}</h3>
            <p>${model.desc}</p>
            <a href="page/modeles/${model.url}" class="btn-create">Sélectionner</a>
            <div class="card-actions">
                <i class="fa-solid fa-pen-to-square action-icon edit-icon" onclick="openEditModel(${model.id})"></i>
                <i class="fa-solid fa-trash action-icon delete-icon" onclick="deleteModel(${model.id})"></i>
            </div>
        </div>
    `).join('');
    document.getElementById('mainBody').classList.add('slide-active');
}

function slideBack() {
    document.getElementById('mainBody').classList.remove('slide-active');
}

// --- RENDU DES GRILLES ---
function renderGrids() {
    document.getElementById('documentGrid').innerHTML = docTypes.map(type => {
        const hasModels = modelsData.some(m => m.category_id == type.id);
        const showDelete = !type.isMulti || (type.isMulti && !hasModels);
        return `
            <div class="card">
                <i class="fa-solid fa-circle-info btn-info" onclick="showDetails('${type.titre.replace(/'/g, "\\'")}', '${type.details ? type.details.replace(/'/g, "\\'").replace(/\n/g, "<br>") : ""}')"></i>
                <div class="icon-box"><i class="fa-solid ${type.icon}"></i></div>
                <h3>${type.titre}</h3>
                <p>${type.desc}</p>
                ${type.isMulti 
                    ? `<button onclick="slideToModels(${type.id}, '${type.titre}')" class="btn-create">Voir Modèles</button>`
                    : `<a href="page/modeles/${type.url}" class="btn-create">Créer</a>`
                }
                <div class="card-actions">
                    <i class="fa-solid fa-pen-to-square action-icon edit-icon" onclick="openEditDoc(${type.id})"></i>
                    ${showDelete ? `<i class="fa-solid fa-trash action-icon delete-icon" onclick="deleteDoc(${type.id})"></i>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// --- MODIFICATION ---
function openEditDoc(id) {
    const doc = docTypes.find(d => d.id == id);
    selectedIcon = doc.icon;
    modalContent.innerHTML = `
        <h2>Modifier Document</h2>
        <input type="text" id="editDocTitle" value="${doc.titre}">
        <input type="text" id="editDocDesc" value="${doc.desc}">
        <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="editIsMulti" ${doc.isMulti ? 'checked' : ''} style="width: auto; margin: 0; cursor: pointer;">
            <label for="editIsMulti" style="font-size: 0.85rem; font-weight: bold; color: var(--poly-blue); cursor: pointer;">Plusieurs modèles ?</label>
        </div>
        <textarea id="editDocDetails" placeholder="Plus de détails...">${doc.details}</textarea>
        <div id="editUrlContainer">
            <input type="text" id="editDocLink" value="${doc.url}" placeholder="Fichier">
        </div>
        <p class="label-mini">Choisir une icône :</p>
        <div class="icon-selector" id="iconSelector">${generateIconList()}</div>
        <div class="modal-btns">
            <button onclick="closeModal()" class="btn-cancel">Annuler</button>
            <button onclick="updateDocument(${id})" class="btn-main">Enregistrer</button>
        </div>
    `;
    const check = document.getElementById('editIsMulti');
    const container = document.getElementById('editUrlContainer');
    container.style.display = check.checked ? 'none' : 'block';
    check.addEventListener('change', () => { container.style.display = check.checked ? 'none' : 'block'; });
    setupIconSelection();
    modal.style.display = 'flex';
}

function openEditModel(id) {
    const model = modelsData.find(m => m.id == id);
    selectedIcon = model.icon;
    modalContent.innerHTML = `
        <h2>Modifier Modèle</h2>
        <input type="text" id="editModelTitle" value="${model.titre}">
        <input type="text" id="editModelDesc" value="${model.desc}">
        <textarea id="editModelDetails">${model.details}</textarea>
        <input type="text" id="editModelLink" value="${model.url}">
        <p class="label-mini">Choisir une icône :</p>
        <div class="icon-selector" id="iconSelector">${generateIconList()}</div>
        <div class="modal-btns">
            <button onclick="closeModal()" class="btn-cancel">Annuler</button>
            <button onclick="updateModel(${id})" class="btn-main">Enregistrer</button>
        </div>
    `;
    setupIconSelection();
    modal.style.display = 'flex';
}

// --- SUPPRESSION ---
function deleteDoc(id) {
    if (!confirm("Confirmer la suppression de ce document ?")) return;
    const formData = new FormData();
    formData.append('id', id);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', './backend/php/deleteDocument.php', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const res = JSON.parse(xhr.responseText);
                if (res.status === 'success') {
                    docTypes = docTypes.filter(d => d.id != id);
                    renderGrids();
                } else alert(res.message);
            } catch(e) { console.error("Erreur JSON:", xhr.responseText); }
        }
    };
    xhr.send(formData);
}

function deleteModel(id) {
    if (!confirm("Confirmer la suppression de ce modèle ?")) return;
    const formData = new FormData();
    formData.append('id', id);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', './backend/php/deleteModele.php', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const res = JSON.parse(xhr.responseText);
                if (res.status === 'success') {
                    modelsData = modelsData.filter(m => m.id != id);
                    slideToModels(currentCategoryId, document.getElementById('pageTitle').innerText);
                } else alert(res.message);
            } catch(e) { console.error("Erreur JSON:", xhr.responseText); }
        }
    };
    xhr.send(formData);
}

// --- MISE À JOUR ---
function updateDocument(id) {
    const title = document.getElementById('editDocTitle').value;
    const desc = document.getElementById('editDocDesc').value;
    const details = document.getElementById('editDocDetails').value;
    const isMulti = document.getElementById('editIsMulti').checked ? 1 : 0;
    const link = document.getElementById('editDocLink').value;
    if (!title) { alert("Le titre est obligatoire"); return; }
    const formData = new FormData();
    formData.append('id', id);
    formData.append('titre', title);
    formData.append('description', desc);
    formData.append('details_doc', details);
    formData.append('icon', selectedIcon);
    formData.append('is_multi', isMulti);
    formData.append('url_direct', isMulti ? '' : link);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', './backend/php/updateDocument.php', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const res = JSON.parse(xhr.responseText);
                if (res.status === 'success') {
                    const index = docTypes.findIndex(d => d.id == id);
                    docTypes[index] = { id, titre: title, desc, details, icon: selectedIcon, isMulti, url: isMulti ? '' : link };
                    renderGrids();
                    closeModal();
                } else alert(res.message);
            } catch(e) { console.error("Erreur JSON:", xhr.responseText); }
        }
    };
    xhr.send(formData);
}

function updateModel(id) {
    const title = document.getElementById('editModelTitle').value;
    const desc = document.getElementById('editModelDesc').value;
    const details = document.getElementById('editModelDetails').value;
    const link = document.getElementById('editModelLink').value;
    if (!title || !link || !currentCategoryId) { alert("Champs obligatoires manquants"); return; }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('titre', title);
    formData.append('description', desc);
    formData.append('details_mod', details);
    formData.append('icon', selectedIcon);
    formData.append('file_path', link);
    formData.append('category_id', currentCategoryId);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', './backend/php/updateModele.php', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const res = JSON.parse(xhr.responseText);
                if (res.status === 'success') {
                    const index = modelsData.findIndex(m => m.id == id);
                    modelsData[index] = { id, titre: title, desc, details, icon: selectedIcon, url: link, category_id: currentCategoryId };
                    slideToModels(currentCategoryId, document.getElementById('pageTitle').innerText);
                    closeModal();
                } else alert(res.message);
            } catch(e) { console.error("Erreur JSON:", xhr.responseText); }
        }
    };
    xhr.send(formData);
}

// --- FORMULAIRES AJOUT ---
document.getElementById('addDocBtn').onclick = () => {
    selectedIcon = "fa-file-lines";
    modalContent.innerHTML = `
        <h2>Nouveau Document</h2>
        <input type="text" id="docTitle" placeholder="Nom du document">
        <input type="text" id="docDesc" placeholder="Description courte">
        <div style="margin: 10px 0; display: flex; align-items: center; gap: 10px;">
            <input type="checkbox" id="isMultiModel" style="width: auto; margin: 0; cursor: pointer;">
            <label for="isMultiModel" style="font-size: 0.85rem; font-weight: bold; color: var(--poly-blue); cursor: pointer;">Plusieurs modèles disponibles ?</label>
        </div>
        
        <textarea id="docDetails" placeholder="Plus de détails..." style="width: 100%; box-sizing: border-box; margin-top: 10px; padding: 10px; border-radius: 8px; border: 1px solid #ddd;"></textarea>

        <div id="urlInputContainer">
            <input type="text" id="docLink" placeholder="Nom du fichier (ex: doc.html)">
        </div>
        
        <p class="label-mini">Choisir une icône :</p>
        <div class="icon-selector" id="iconSelector">${generateIconList()}</div>
        <div class="modal-btns">
            <button onclick="closeModal()" class="btn-cancel">Annuler</button>
            <button onclick="addNewDocument()" class="btn-main">Ajouter</button>
        </div>
    `;
    const check = document.getElementById('isMultiModel');
    const urlContainer = document.getElementById('urlInputContainer');
    check.checked = false;
    urlContainer.style.display = 'block';
    check.addEventListener('change', () => { urlContainer.style.display = check.checked ? 'none' : 'block'; });
    setupIconSelection();
    modal.style.display = 'flex';
};

document.getElementById('addModelBtn').onclick = () => {
    selectedIcon = "fa-graduation-cap";
    modalContent.innerHTML = `
        <h2>Nouveau Modèle</h2>
        <input type="text" id="modelTitle" placeholder="Nom du modèle">
        <input type="text" id="modelDesc" placeholder="Description courte">
        <textarea id="modelDetails" placeholder="Plus de détails..." style="width: 100%; box-sizing: border-box; margin-bottom: 10px; padding: 10px; border-radius: 8px; border: 1px solid #ddd;"></textarea>
        <input type="text" id="modelLink" placeholder="Nom du fichier">
        <p class="label-mini">Choisir une icône :</p>
        <div class="icon-selector" id="iconSelector">${generateIconList()}</div>
        <div class="modal-btns">
            <button onclick="closeModal()" class="btn-cancel">Annuler</button>
            <button onclick="addNewModel()" class="btn-main">Ajouter</button>
        </div>
    `;
    setupIconSelection();
    modal.style.display = 'flex';
};

// --- LOGIQUE COMMUNE ---
function generateIconList() {
    const icons = [
    // Fichiers génériques
    'fa-file','fa-file-lines','fa-file-pdf','fa-file-word','fa-file-excel','fa-file-powerpoint','fa-file-image','fa-file-audio','fa-file-video','fa-file-archive','fa-file-alt',
    
    // Documents officiels / administratifs
    'fa-file-signature','fa-file-circle-check','fa-file-circle-xmark','fa-file-invoice','fa-file-invoice-dollar','fa-file-contract','fa-receipt','fa-file-prescription','fa-file-medical','fa-file-shield','fa-file-certificate','fa-file-award',
    
    // Sécurité / confidentialité
    'fa-shield','fa-shield-halved','fa-lock','fa-lock-open','fa-key','fa-user-lock','fa-user-shield','fa-eye-slash','fa-eye',
    
    // Dossiers / Organisation
    'fa-folder','fa-folder-open','fa-folder-tree','fa-archive','fa-box-archive','fa-box','fa-box-open','fa-database','fa-server','fa-cloud','fa-cloud-arrow-up','fa-cloud-arrow-down','fa-upload','fa-download',
    
    // Notes, livres, éducation
    'fa-book','fa-book-open','fa-book-atlas','fa-book-journal-whills','fa-notebook','fa-note-sticky','fa-scroll','fa-graduation-cap','fa-user-graduate','fa-school','fa-school-flag','fa-university','fa-chalkboard','fa-chalkboard-user','fa-award','fa-certificate','fa-stamp','fa-signature',
    
    // Personnes / RH
    'fa-user','fa-user-check','fa-user-clock','fa-user-tie','fa-users','fa-users-rectangle','fa-id-card','fa-id-badge','fa-address-card','fa-briefcase','fa-building','fa-building-user','fa-building-columns','fa-person-booth',
    
    // Listes / Planning
    'fa-clipboard','fa-clipboard-list','fa-clipboard-check','fa-clipboard-user','fa-list','fa-list-check','fa-list-ol','fa-list-ul','fa-calendar','fa-calendar-check','fa-calendar-days','fa-clock','fa-stopwatch','fa-bell','fa-bell-slash',
    
    // Communication / Notifications
    'fa-bullhorn','fa-megaphone','fa-envelope','fa-envelope-open','fa-envelope-circle-check','fa-paper-plane','fa-comment','fa-comments',
    
    // Actions / Edition
    'fa-print','fa-pen','fa-pen-nib','fa-pen-to-square','fa-highlighter','fa-marker','fa-square-check','fa-square-xmark','fa-check','fa-check-double','fa-xmark','fa-circle-info','fa-circle-question','fa-circle-exclamation','fa-triangle-exclamation','fa-arrows-rotate','fa-exchange-alt','fa-upload','fa-download',
    
    // Sécurité juridique / contrats
    'fa-file-contract','fa-file-certificate','fa-file-shield','fa-gavel','fa-balance-scale','fa-scale-balanced','fa-scroll-torah','fa-book-dead',
    
    // Divers / codes QR, barcode
    'fa-qrcode','fa-barcode','fa-layer-group','fa-diagram-project','fa-sitemap','fa-network-wired'
];

    return icons.map(icon => `<i class="fa-solid ${icon} ${icon === selectedIcon ? 'active' : ''}" data-icon="${icon}"></i>`).join('');
}

function setupIconSelection() {
    const selector = document.getElementById('iconSelector');
    selector.addEventListener('click', (e) => {
        if(e.target.tagName === 'I') {
            document.querySelectorAll('.icon-selector i').forEach(i => i.classList.remove('active'));
            e.target.classList.add('active');
            selectedIcon = e.target.getAttribute('data-icon');
        }
    });
}

function closeModal() { modal.style.display = 'none'; }
window.onclick = (e) => { if(e.target == modal) closeModal(); };

// --- AJOUT ---
function addNewDocument() {
    const title = document.getElementById('docTitle').value;
    const desc = document.getElementById('docDesc').value;
    const details = document.getElementById('docDetails').value;
    const isMulti = document.getElementById('isMultiModel').checked ? 1 : 0;
    const link = document.getElementById('docLink').value;

    if (!title) { alert("Le titre est obligatoire"); return; }

    const formData = new FormData();
    formData.append('titre', title);
    formData.append('description', desc);
    formData.append('details_doc', details);
    formData.append('icon', selectedIcon);
    formData.append('is_multi', isMulti);
    formData.append('url_direct', isMulti ? '' : link);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', './backend/php/addNewDocument.php', true);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200){
            try{
                const res = JSON.parse(xhr.responseText);
                if(res.status === 'success'){
                    const newDoc = { 
                        id: res.id || Date.now(),
                        titre: title, 
                        desc, 
                        details, 
                        icon: selectedIcon, 
                        isMulti, 
                        url: isMulti ? '' : link 
                    };
                    docTypes.push(newDoc);
                    closeModal();
                    renderGrids();
                } else alert(res.message);
            }catch(e){ console.error(e); }
        }
    };
    xhr.send(formData);
}

function addNewModel() {
    const title = document.getElementById('modelTitle').value;
    const desc = document.getElementById('modelDesc').value;
    const details = document.getElementById('modelDetails').value;
    const link = document.getElementById('modelLink').value;
    if (!title || !link || !currentCategoryId) { alert("Champs obligatoires manquants"); return; }

    const formData = new FormData();
    formData.append('titre', title);
    formData.append('description', desc);
    formData.append('details_mod', details);
    formData.append('icon', selectedIcon);
    formData.append('file_path', link);
    formData.append('category_id', currentCategoryId);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', './backend/php/addModele.php', true);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4 && xhr.status === 200){
            try{
                const res = JSON.parse(xhr.responseText);
                if(res.status === 'success'){
                    const newModel = { id: res.id, titre: title, desc, details, icon: selectedIcon, url: link, category_id: currentCategoryId };
                    modelsData.push(newModel);
                    slideToModels(currentCategoryId, document.getElementById('pageTitle').innerText);
                    closeModal();
                } else alert(res.message);
            }catch(e){ console.error(e); }
        }
    };
    xhr.send(formData);
}

// --- INIT ---
getModele();
getCategory();
window.onload = renderGrids;