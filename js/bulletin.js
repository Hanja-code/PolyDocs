let matieresData = [];
// CHARGEMENT DE LA BASE DE DONNÉES LOCALE
let bulletinsValides = JSON.parse(localStorage.getItem('base_polymathes')) || [];

function toggleDateAuto() {
    const isAuto = document.getElementById('check-date-auto').checked;
    const dateInput = document.getElementById('in-dateB');
    if (dateInput) dateInput.style.display = isAuto ? 'none' : 'block';
    updateBulletin();
}

function getFormattedDate(dateObj = new Date()) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return dateObj.toLocaleDateString('fr-FR', options);
}

function ajouterMatiere() {
    matieresData.push({ mat: "", coef: 1, note: 0, appreciation: "" });
    renderInputs();
    updateBulletin();
}

// NOUVELLE FONCTION : SUPPRIMER UNE MATIÈRE
function supprimerMatiere(index) {
    matieresData.splice(index, 1);
    renderInputs();
    updateBulletin();
}

function renderInputs() {
    const container = document.getElementById('matieres-inputs');
    if(!container) return;
    container.innerHTML = '<h3>Matières</h3>';
    matieresData.forEach((m, index) => {
        container.innerHTML += `
            <div class="matiere-row" style="background:#34495e; padding:5px; margin-bottom:5px; border-radius:4px; position:relative;">
                <button onclick="supprimerMatiere(${index})" style="position:absolute; right:5px; top:5px; background:#e74c3c; color:white; border:none; border-radius:3px; cursor:pointer; font-size:7pt; padding:2px 5px;">X</button>
                <input type="text" placeholder="Matière" value="${m.mat}" oninput="matieresData[${index}].mat=this.value; updateBulletin()">
                <div style="display:flex; gap:5px;">
                    <input type="number" placeholder="Coef" value="${m.coef}" oninput="matieresData[${index}].coef=parseFloat(this.value)||0; updateBulletin()">
                    <input type="number" step="0.5" placeholder="Note" value="${m.note}" oninput="matieresData[${index}].note=parseFloat(this.value)||0; updateBulletin()">
                </div>
                <textarea placeholder="Appréciation" oninput="matieresData[${index}].appreciation=this.value; updateBulletin()">${m.appreciation}</textarea>
            </div>`;
    });
}

// CALCUL MOYENNE DE CLASSE AUTOMATIQUE SELON LA BASE
function calculerMoyenneClasseAuto(classe, annee, trim) {
    const bulletinsConcernes = bulletinsValides.filter(b => 
        b.classe.toLowerCase() === classe.toLowerCase() && 
        b.annee === annee && 
        b.trim === trim
    );

    if (bulletinsConcernes.length === 0) return 0;

    let sommeMoyennes = bulletinsConcernes.reduce((acc, b) => {
        let totalP = 0, totalC = 0;
        b.notes.forEach(n => { totalP += (n.note * n.coef); totalC += n.coef; });
        return acc + (totalC > 0 ? (totalP / totalC) : 0);
    }, 0);

    return (sommeMoyennes / bulletinsConcernes.length).toFixed(1);
}

function updateBulletin() {
    const checkAuto = document.getElementById('check-date-auto');
    const isAuto = checkAuto ? checkAuto.checked : true;
    const dateInput = document.getElementById('in-dateB');
    const showCachet = document.getElementById('check-cachet')?.checked;
    const showSignature = document.getElementById('check-signature')?.checked;

    let dateAffiche = isAuto ? getFormattedDate(new Date()) : (dateInput?.value ? getFormattedDate(new Date(dateInput.value.replace(/-/g, '\/'))) : "");
    
    const data = {
        annee: document.getElementById('in-annee').value,
        trim: document.getElementById('in-trim').value,
        nom: document.getElementById('in-nom').value || "",
        classe: document.getElementById('in-classe').value || "",
        matricule: document.getElementById('in-matr').value || "",
        verdict: document.getElementById('in-verdict').value || "",
        notes: matieresData
    };

    // Calcul Moyenne Élève
    let totalPoints = 0, totalCoef = 0;
    const lignesNotes = data.notes.map(n => {
        totalPoints += (n.note * n.coef); totalCoef += n.coef;
        return `<tr><td>${n.mat}</td><td style="text-align:center">${n.coef}</td><td style="text-align:center"><strong>${n.note.toFixed(1)}</strong></td><td>${n.appreciation}</td></tr>`;
    }).join('');

    const moyenneEleve = totalCoef > 0 ? (totalPoints / totalCoef).toFixed(1) : "0.0";
    
    // Calcul Moyenne de Classe Auto
    const moyClasseAuto = calculerMoyenneClasseAuto(data.classe, data.annee, data.trim);

    document.getElementById('app').innerHTML = `
    <div class="bulletin-container">
        <div class="header">
            <div class="logo-and-title">
                <img src="../LOGO/IMG-20251027-WA0002.jpg" alt="Logo" class="logo">
                <h1>BULLETIN TRIMESTRIEL</h1>
            </div>
            <div class="school-coordinates">Lot AB 205 Ter Antsakaviro – TANA 101<br>Mobile: +261 38 17 078 45</div>
            <p class="academic-info">Année Scolaire : ${data.annee} - Trimestre : ${data.trim}</p>
        </div>
        <div class="info-eleve">
            <div><strong>Nom et Prénom :</strong> ${data.nom}</div>
            <div><strong>Classe :</strong> ${data.classe}<br><strong>N° Matr. :</strong> ${data.matricule}</div>
        </div>
        <table class="notes-table"><colgroup><col><col><col><col></colgroup>
            <thead><tr><th>Matière</th><th>Coeff.</th><th>Note / 20</th><th>Appréciation du Professeur</th></tr></thead>
            <tbody>${lignesNotes}</tbody>
        </table>
        <div class="footer-summary">
            <div class="verdict-conseil"><h3>Verdict du Conseil de Classe</h3><p>${data.verdict}</p></div>
            <table class="recapitulatif">
                <tr><td class="titre">Moyenne Générale :</td><td class="valeur">${moyenneEleve} / 20</td></tr>
                <tr><td class="titre">Moyenne de la classe :</td><td class="valeur">${moyClasseAuto} / 20</td></tr>
            </table>
        </div>
        <div class="signatures">
            <div class="date-lieu">Fait à Antananarivo, le <span class="date-bleue">${dateAffiche}</span></div>
            <div class="sign-droite">
                <strong>Signature du Chef d'Établissement :</strong><br><br>
                ${showCachet ? `<img src="../LOGO/cachet_polymathes.png" class="img-cachet" alt="Cachet">` : ''}
                ${showSignature ? `<img src="../LOGO/signature_dg.png" class="img-signature" alt="Signature">` : ''}
                <span>_________________________</span>
            </div>
        </div>
    </div>`;
}

function validerBulletin() {
    const dataObj = {
        id: Date.now(),
        annee: document.getElementById('in-annee').value,
        trim: document.getElementById('in-trim').value,
        nom: document.getElementById('in-nom').value.trim(),
        dateN: document.getElementById('in-dateN').value,
        classe: document.getElementById('in-classe').value,
        matr: document.getElementById('in-matr').value,
        verdict: document.getElementById('in-verdict').value,
        notes: JSON.parse(JSON.stringify(matieresData))
    };

    if (!dataObj.nom || !dataObj.classe) return alert("Nom et Classe obligatoires");

    const doublon = bulletinsValides.find(b => 
        b.nom.toLowerCase() === dataObj.nom.toLowerCase() && 
        b.annee === dataObj.annee && b.trim === dataObj.trim
    );
    if (doublon) return alert("Un bulletin existe déjà pour cet élève ce trimestre.");

    bulletinsValides.push(dataObj);
    sauvegarderEtRendre();
}

function sauvegarderEtRendre() {
    localStorage.setItem('base_polymathes', JSON.stringify(bulletinsValides));
    renderListe();
    updateBulletin();
}

function renderListe() {
    const filtre = document.getElementById('filtre-classe').value.toLowerCase();
    const container = document.getElementById('container-valides');
    const filtered = bulletinsValides.filter(b => b.classe.toLowerCase().includes(filtre));

    container.innerHTML = filtered.map(b => `
        <div class="item-valide">
            <strong>${b.nom}</strong><br><small>${b.classe} (${b.annee} - T${b.trim})</small>
            <div class="actions-liste">
                <button class="btn-mini btn-edit" onclick="chargerBulletin('${b.id}')">Modifier</button>
                <button class="btn-mini btn-del" onclick="supprimerBulletin('${b.id}')">Supprimer</button>
            </div>
        </div>`).reverse().join('') + 
        `<button onclick="viderBase()" style="background:#c0392b; color:white; border:none; padding:8px; width:100%; border-radius:4px; cursor:pointer; margin-top:10px; font-size:8pt;">VIDER TOUTE LA LISTE</button>`;
}

function viderBase() {
    if(confirm("Supprimer TOUS les bulletins ?")) {
        bulletinsValides = [];
        sauvegarderEtRendre();
    }
}

function chargerBulletin(id) {
    const b = bulletinsValides.find(item => item.id == id);
    if (!b) return;
    document.getElementById('in-annee').value = b.annee;
    document.getElementById('in-trim').value = b.trim;
    document.getElementById('in-nom').value = b.nom;
    document.getElementById('in-dateN').value = b.dateN;
    document.getElementById('in-classe').value = b.classe;
    document.getElementById('in-matr').value = b.matr;
    document.getElementById('in-verdict').value = b.verdict;
    matieresData = JSON.parse(JSON.stringify(b.notes));
    renderInputs();
    updateBulletin();
}

function supprimerBulletin(id) {
    if(confirm("Supprimer ce bulletin ?")) {
        bulletinsValides = bulletinsValides.filter(item => item.id != id);
        sauvegarderEtRendre();
    }
}

renderInputs();
renderListe();
updateBulletin();