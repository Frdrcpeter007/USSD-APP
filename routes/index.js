var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/ussd', (req, res) => {
    // Read the variables sent via POST from our API
    const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;

    let law = [
            { id: 1, title: "Law 1", content: "Ceci est l'article 1 du bail", articles: [{ id: 1, title: 'Article 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Article 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Article 3', content: 'Le contenu du bail là' }] }, 
            { id: 2, title: "Law 2", content: "Ceci est l'article 2 du bail", articles: [{ id: 1, title: 'Article 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Article 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Article 3', content: 'Le contenu du bail là' }] },
            { id: 3, title: "Law 3", content: "Ceci est l'article 3 du bail", articles: [{ id: 1, title: 'Article 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Article 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Article 3', content: 'Le contenu du bail là' }] }, 
            { id: 4, title: "Law 4", content: "Ceci est l'article 4 du bail", articles: [{ id: 1, title: 'Article 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Article 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Article 3', content: 'Le contenu du bail là' }] }, 
            { id: 5, title: "Law 5", content: "Ceci est l'article 5 du bail", articles: [{ id: 1, title: 'Article 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Article 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Article 3', content: 'Le contenu du bail là' }] }
        ],
        decret = [
            { id: 1, title: "Décret 1", content: "Ceci est le décret 1 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Alinéa 3', content: 'Le contenu du bail là' }] },
            { id: 2, title: "Décret 2", content: "Ceci est le décret 2 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Alinéa 3', content: 'Le contenu du bail là' }] }, 
            { id: 3, title: "Décret 3", content: "Ceci est le décret 3 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Alinéa 3', content: 'Le contenu du bail là' }] }, 
            { id: 4, title: "Décret 4", content: "Ceci est le décret 4 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Alinéa 3', content: 'Le contenu du bail là' }] }, 
            { id: 5, title: "Décret 5", content: "Ceci est le décret 5 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là' }, { id: 3, title: 'Alinéa 3', content: 'Le contenu du bail là' }] }
        ],
        arret = [
            { id: 1, title: "Arrêté 1", content: "Ceci est l'arrêté 1 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là'}]}, 
            { id: 2, title: "Arrêté 2", content: "Ceci est l'arrêté 2 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là'}]}, 
            { id: 3, title: "Arrêté 3", content: "Ceci est l'arrêté 3 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là'}]}, 
            { id: 4, title: "Arrêté 4", content: "Ceci est l'arrêté 4 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là'}]}, 
            { id: 5, title: "Arrêté 5", content: "Ceci est l'arrêté 5 du bail", articles: [{ id: 1, title: 'Alinéa 1', content: 'Le contenu du bail là' }, { id: 2, title: 'Alinéa 2', content: 'Le contenu du bail là'}]}
        ];

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
        let tab = text == '1' ? law : text == '2' ? decret : text == '3' ? arret : [];
        let category = text == '1' ? "Lois" : text == '2' ? "Décrets" : "Arrêtés";
        response = `CON Catégorie "${category} du Numérique"

      ${tab.map(item => `${item.id}. ${item.title}`).join('\n')}
      
      0. Voir la suite de la liste`;
    } else if (/^[1|2|3]\*\d+$/g.test(text)) {

        let tab = text[0] == '1' ? law : text[0] == '2' ? decret : text[0] == '3' ? arret : [],
            articles = tab[parseInt(text[0])].articles;
        response = `CON Enoncé de la loi:

        ${articles.map(item => `${item.id}. ${item.title}`).join('\n')}
        
        0. Voir la suite de la liste`;

    } else if (/^[1|2|3]\*\d+\*\d+$/g.test(text)) {

        let tab = text[0] == '1' ? law : text[0] == '2' ? decret : text[0] == '3' ? arret : [],
            articles = tab[parseInt(text[0])].articles;

        response = `CON Enoncé de la loi:
      "${articles.find(item => item.id == text.split('*')[2]).content}"
      
      1. Avoir explication (Français)
      2. Avoir explication (Lingala)
      3. Donnez votre avis`;

    } else if (/^[1|2|3]\*\d+\*\d+\*[1|2]$/g.test(text)) {

        let language = text.split('*')[3] == '1' ? 'Français' : 'Lingala';
        response = `END Votre demande est en cours de traitement, nous vous enverons une explication en ${language} par SMS`;

    } else if (/^[1|2|3]\*\d+\*\d+\*3$/g.test(text)) {

        let tab = text[0] == '1' ? law : text[0] == '2' ? decret : text[0] == '3' ? arret : [],
            articles = tab[parseInt(text[0])].articles;
        response = `CON Donnez votre avis sur:
    "${tab.find(item => item.id == text.split('*')[2]).content}"
    
    Votre avis:`
    } else if (/^[1|2|3]\*\d+\*\d+\*3\*\w+/g.test(text)) {
        let review = text.split('*')[text.split('*').length - 1];
        response = `END Votre avis a bien été pris en compte. Merci pour votre contribution.
    
    Votre avis: "${review}"`;

    } else if (text == '5') {
        
        response = `CON Quel est l'objet de votre demande de contact: 
        
        1. Demande d'information
        2. Demande d'aide
        3. Demande de conseil
        4. Demande de décision
        5. Autre`;

    } else if (/^5\*[1-4]$/g.test(text) || /^5\*5\*\w+$/g.test(text)) {

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

module.exports = router;
