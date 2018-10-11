function onProgress(event) {
    if (event.lengthComputable) {
        var percentComplete = (event.loaded / event.total)*100;
        console.log("Téléchargement: %d%%", percentComplete);
    } else {
        // Impossible de calculer la progression puisque la taille totale est inconnue
    }
}

function onError(event) {
    console.error("Une erreur " + event.target.status + " s'est produite au cours de la réception du document.");
}

function onLoadEnd(event) {
    // Cet événement est exécuté, une fois la requête terminée.
    console.log("Le transfert est terminé.");
}

