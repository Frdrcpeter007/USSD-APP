const express = require('express');
const router = express.Router();
const API = process.env.API_URL;
const axios = require('axios').default;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/ussd', async (req, res) => {
    // Read the variables sent via POST from our API
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;


    let response = '';

    if (text == '') {
        // This is the first request. Note how we start the response with CON
        response = `CON Veuillez selectionner un service e-Mobeko:
      
      1. Consulter les lois
      2. Consulter les décrets 
      3. Consulter les arrêtés
      4. À la une du numérique
      5. Contactez un juriste en droit du numérique`;

    } else if (/^[1|2|3]$/g.test(text)) {
        let tab = await getData(`texte/${text}`);
        let category = text == '1' ? "Lois" : text == '2' ? "Décrets" : "Arrêtés";
        response = `CON Catégorie "${category} du Numérique"

      ${tab.data.map(item => `${item.id}. ${item.titre}`).join('\n\n')}
      
      0. Voir la suite de la liste`;
    } else if (/^[1|2|3]\*\d+$/g.test(text)) {
        let num = text.split('*')[text.split('*').length - 1],
            chapitre = await getData(`/chapitre/list/text/ussd/${num}`);

        response = `CON Liste des chapitre:

        ${chapitre.data.map(item => `${item.id}. ${item.titre}`).join('\n\n')}
        
        0. Voir la suite de la liste`;

    } else if (/^[1|2|3]\*\d+\*\d+$/g.test(text)) {
        let num = text.split('*')[text.split('*').length - 1],
            chapitre = await getData(`/chapitre/list/article/${num}`);

        response = `CON Liste des articles:

        ${chapitre.data[0].Article.map(item => `${item.id}. ${item.titre}`).join('\n\n')}
        
        0. Voir la suite de la liste`;

    } 
    
    else if (/^[1|2|3]\*\d+\*\d+\*\d+$/g.test(text)) {

        let num = text.split('*')[text.split('*').length - 1],
            article = await getData(`article/${num}`);

        response = `CON Enoncé de l'article:
      "${article.data.titre}"
      
      1. Avoir explication (Français)
      2. Avoir explication (Lingala)
      3. Donnez votre avis`;

    } else if (/^[1|2|3]\*\d+\*\d+\*\d+\*[1|2]$/g.test(text)) {

        let language = text.split('*')[3] == '1' ? 'Français' : 'Lingala';
        response = `END Votre demande est en cours de traitement, nous vous enverons une explication en ${language} par SMS`;

    } else if (/^[1|2|3]\*\d+\*\d+\*\d+\*3$/g.test(text)) {

        let num = text.split('*')[text.split('*').length - 2],
            article = await getData(`article/${num}`);
        response = `CON Donnez votre avis sur:
    "${article.data.titre}"
    
    Votre avis:`
    } else if (/^[1|2|3]\*\d+\*\d+\*\d+\*3\*\w+/g.test(text)) {
        let review = text.split('*')[text.split('*').length - 1];
        response = `END Votre avis a bien été pris en compte. Merci pour votre contribution.
    
    Votre avis: "${review}"`;

    } else if (text == '4') {
        
        response = `CON Souhaitez-vous être averti des dernières nouvelle du numérique ?: 
        
        0. Non
        1. Oui`;

    } else if(/^4\*[0|1]$/g.test(text)) {
        
        let textResponse = text.split('*')[text.split('*').length - 1] == '0' ? 'Pas de newsletter, nous vous enverrons uniquement la dernière actu de cette semaine par SMS' : 'Vous recevrez la newsletter du numérique par SMS chaque fois que cela sera partagé !';
        response = `END ${textResponse}`;

    } else if (text == '5') {
        
        response = `CON Quel est l'objet de votre demande de contact: 
        
        1. Demande d'information
        2. Demande d'aide
        3. Demande de conseil
        4. Demande de décision
        5. Autre`;

    } else if (/^5\*[1-4]$/g.test(text) || /^5\*5\*\w+/g.test(text)) {

        response = `END Un spécialiste en droit du numérique vous contactera dans les plus brefs délais`;

    } else if(/^5\*5$/g.test(text)) {
        
        response = `CON Taper l'objet votre demande de contact d'un juriste: `;

    } else {
        console.log(text);
        response = `END La commande entrée n'est pas correct, e-Mobeko à votre service pour vous expliciter les textes juridique concernant le numérique en RD Congo...`
    }

    // Send the response back to the API
    res.set('Content-Type: text/plain');
    res.send(response);
});


async function getData(url) {
    try {
       let res = await axios({
            url: `${API}/${url}`,
            method: 'get',
            timeout: 8000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(res.status == 200){
            // test for status you want, etc
            console.log(res.status)
        }    
        // Don't forget to return something   
        return res.data
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = router;
