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
      response = `CON Catégorie "Loi du Numérique
      1. Loi 1
      2. Loi 2
      3. Loi 3
      4. Loi 4
      5. Loi 5
      
      Taper 0# pour voir la suite de la liste`;
  } else if ( text == '2') {
      response = `END Your phone number is ${phoneNumber}`;
  } else if ( text == '1*1') {
     
      response = `CON Enoncé de la loi:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse nesciunt laboriosam repudiandae."
      
      1. Avoir explication (Français)
      2. Avoir explication (Lingala)
      3. Donnez votre avis`;

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
