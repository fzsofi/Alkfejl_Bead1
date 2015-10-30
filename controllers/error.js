
// controllers/error.js
var express = require('express');
var moment = require('moment');
var router = express.Router();

var decorateErrors = require('../viewmodels/error');

router.param('id', function(req, res, next, id) {
    req.id = id;
    next(); 
});

// Hibalista oldal
router.get('/list', function (req, res) {
    
    req.app.models.error.find().then(function (errors) {
        
        res.render('errors/list', {
            errors: decorateErrors(errors),
            messages: req.flash('info')
        });
    });
});

router.get('/edit/:id', function (req, res) {
    
    var id = req.id;
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    
    req.app.models.error.findOne({ id: id }).then(function (data) {
        
        res.render('errors/edit', {
            validationErrors: validationErrors,
            data: data
        });
        
    });
    
});

// Hiba modositasa POST
router.post('/edit/:id', function(req, res) {
    
   // adatok ellenőrzése
    req.checkBody('tipus', 'Hibás helyszín').notEmpty().withMessage('Kötelező megadni!');
    req.sanitizeBody('leiras').escape();
    req.checkBody('leiras', 'Hibás leírás').notEmpty().withMessage('Kötelező megadni!');
    req.checkBody('hatarido', 'Hibás hatarido').notEmpty().withMessage('Kötelező megadni!');
    
    var validationErrors = req.validationErrors(true);
    
    if (validationErrors) {
        // űrlap megjelenítése a hibákkal és a felküldött adatokkal
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/errors/edit/'+req.id);
    }
    else {
       
        req.app.models.error.findOne({ id: req.id }, function(err, error) {
            if (err) {
                return res.send(err);
            }
            
            error['location'] = req.body.tipus;
            error['description'] = req.body.leiras;
            error['dateline'] = req.body.hatarido;
            
            error.save(function(err) {
                if (err) {
                    return res.send(err);
                }
                
                req.flash('info', 'Feladat sikeresen módosítva!');
                res.redirect('/errors/list');
                
            })
            
        });
        
        
    }
    
});

router.get('/delete/:id', function(req, res) {
    
    req.app.models.error.findOne({ id: req.id }, function(err, error) {
        if (err) {
            return res.send(err);
        }
        error.destroy(function(err) {
            if (err) {
                return res.send(err);
            }
            
            req.flash('info', 'Feladat sikeresen törölve!');
            res.redirect('/errors/list');
            
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

