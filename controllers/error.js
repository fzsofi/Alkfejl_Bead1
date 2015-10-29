
// controllers/error.js
var express = require('express');
var router = express.Router();

var decorateErrors = require('../viewmodels/error');

// Hibalista oldal
router.get('/list', function (req, res) {
    req.app.models.error.find().then(function (errors) {
        res.render('errors/list', {
            errors: decorateErrors(errors),
            messages: req.flash('info')
        });
    });
});

// Hiba felvitele
router.get('/new', function(req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('errors/new', {
        validationErrors: validationErrors,
        data: data,
    });
})

// Hiba felvitele POST
router.post('/new', function(req, res) {
   // adatok ellenőrzése
    req.checkBody('tipus', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('hatarido', 'Hibás hatarido').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/errors/new');
    }
    else {
        req.app.models.error.create({
            status: 'new',
            location: req.body.tipus,
            description: req.body.leiras,
            dateline: req.body.hatarido
        })
        .then(function (error) {
            //siker
            req.flash('info', 'Új feladat sikeresen felvéve!');
            res.redirect('/errors/list');
        })
        .catch(function (err) {
            //hiba
            console.log(err)
        });
    }
})

module.exports = router;

