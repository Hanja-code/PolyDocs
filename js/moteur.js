function updateDateFromCal(targetId, val) {
    if (val) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById(targetId).value = new Date(val).toLocaleDateString('fr-FR', options);
        updateFields();
    }
}

function updateFields() {
    const type = document.getElementById('in-type').value;
    const name = document.getElementById('in-name').value || "[NOM]";
    const extra = document.getElementById('in-extra').value || "[INFO]";
    
    // Lecture sécurisée des champs (évite les erreurs si le champ n'existe pas dans le fichier HTML)
    const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : "[DATE]";
    const dateBirth = getVal('in-date-text');
    const dateStart = getVal('in-start-text');
    const classe = getVal('in-classe');
    const contrat = getVal('in-contract');
    // Récupération de l'année scolaire depuis le nouveau champ du formulaire
    const anneeScolaire = getVal('in-annee');

    let htmlContent = "";

    if (type === "Scolarité") {
        htmlContent = `
            <p>Je soussigné, <strong>M. RAJAONARISON Sitraka</strong>, Directeur de l’établissement <strong>Polymathes Ambanidia</strong>, certifie que :</p>
            <div class="student-box">
                <p><span class="label">L’élève :</span> <span class="value">${name}</span></p>
                <p><span class="label">Né le :</span> <span class="value">${dateBirth}</span> &nbsp; <span class="label">à :</span> <span class="value">${extra}</span></p>
                <p><span class="label">Classe fréquentée :</span> <span class="value">${classe}</span> &nbsp; <span class="label">Année scolaire :</span> <span class="value">${anneeScolaire}</span></p>
            </div>
            <p>Est régulièrement inscrit dans notre établissement pour l’année scolaire mentionnée ci-dessus.</p>
        `;
    } else {
        htmlContent = `
            <p>Je soussigné, <strong>RAJAONARISON Sitraka</strong>, Directeur de l’établissement <strong>Polymathes Ambanidia</strong>, certifie que :</p>
            <div class="student-box">
                <p><span class="label">Madame / Monsieur :</span> <span class="value">${name}</span></p>
            </div>
            <p>est employée au sein de notre établissement en qualité de <strong>${extra}</strong>.</p>
            <p>Elle est liée à l’établissement par un <strong>${contrat}</strong> et a débuté ses fonctions le <strong>${dateStart}</strong>.</p>
            <p>Durant son emploi, Madame / Monsieur ${name} a exercé ses missions avec sérieux et professionnalisme.</p>
            <p>Le présent certificat est délivré pour servir et valoir ce que de droit.</p>
        `;
    }

    if(document.getElementById('disp-content')) document.getElementById('disp-content').innerHTML = htmlContent;
    if(document.getElementById('disp-content-2')) document.getElementById('disp-content-2').innerHTML = htmlContent;
}

window.onload = updateFields;