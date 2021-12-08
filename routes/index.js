var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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

  let tab = [{id: 1, title: "Article 1", content: "Ceci est l'article 1"}, {id: 2, title: "Article 2", content: "Ceci est l'article 2"}, {id: 3, title: "Article 3", content: "Ceci est l'article 3"}];

  console.log("sessionId", sessionId);
  console.log("serviceCode", serviceCode);

  let response = '';

  if (text == '') {
      // This is the first request. Note how we start the response with CON
      response = `CON Veuillez selectionner un service:
      1. Consulter les lois
      2. Consulter les décrets 
      3. Consulter les arrêtés
      4. À la une du numérique
      5. Contactez un juriste en droit du numérique`;
  } else if ( text == '1') {
      // Business logic for first level response
      response = `CON Catégorie "Loi du Numérique"
      ${
            tab.map(item => `${item.id}. ${item.title}`).join('\n')
      }
      
      0. Voir la suite de la liste`;
      
  } else if ( text == '2') {
      response = `END Your phone number is ${phoneNumber}`;

  } else if (/^1\*(1-9)*/g.test(text) ) {

      response = `CON Enoncé de la loi:
      "${tab.find(item => item.id == text.split('*')[1]).content}"

      1. Avoir explication (Français)
      2. Avoir explication (Lingala)
      3. Donnez votre avis`;

  } else if (/^1\*1\*(1|2)/g.test(text)) {

    response = `END Votre est en cours de traitement, nous vous enverrons très bien des explications de cette loi en ${text.split('*')[text.split('*').length - 1] == '1' ? 'Français' : 'Lingala'}`;

  } else if ( text == '1*1*3') {
    response = `CON Donnez votre avis sur:
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse nesciunt laboriosam repudiandae.
    
    Votre avis:`
  }

  // Send the response back to the API
  res.set('Content-Type: text/plain');
  res.send(response);
});

module.exports = router;
