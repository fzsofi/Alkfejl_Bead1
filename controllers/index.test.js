
var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe('User visits index page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/');
    });
    
    it('should be successful', function() {
        browser.assert.success();
    });
    
    it('should see welcome page', function() {
        browser.assert.text('div.page-header > h1', 'Egyetemi ToDo');
    });
});


describe('User visits new error page', function (argument) {

    var browser = new Browser();
    
    before(function() {
        return browser.visit('/errors/new');
    });
    
    it('should go to the authentication page', function () {
        browser.assert.redirected();
        browser.assert.success();
        browser.assert.url({ pathname: '/login' });
    });
    
    it('should be able to login with correct credentials', function () {
        browser
            .fill('neptun', 'a')
            .fill('password', 'a')
            .pressButton('button[type=submit]')
            .then(function () {
                browser.assert.redirected();
                browser.assert.success();
                browser.assert.url({ pathname: '/errors/list' });
                //done();
            });
    });
    
    it('should go the error page', function () {
    return browser.visit('/errors/new')
    .then(function () {
        browser.assert.success();
        browser.assert.text('div.page-header > h1', 'Új feladat');
    });
    });

    it('should show errors if the form fields are not right', function (done) {
    return browser
        .fill('tipus', '')
        .fill('leiras', '')
        .fill('hatarido', '')
        .pressButton('button[type=submit]')
        .then(function() {
            // browser.assert.redirected();
            browser.assert.success();
            browser.assert.element('form .form-group:nth-child(1) [name=tipus]');
            browser.assert.hasClass('form .form-group:nth-child(1)', 'has-error');
            browser.assert.element('form .form-group:nth-child(2) [name=leiras]');
            browser.assert.hasClass('form .form-group:nth-child(2)', 'has-error');
            browser.assert.element('form .form-group:nth-child(3) [name=hatarido]');
            browser.assert.hasClass('form .form-group:nth-child(3)', 'has-error');
            done();
        });
    });

    it('should show submit the right-filled form fields and go back to list page', function() {
    browser
        .fill('tipus', 'zh')
        .fill('leiras', 'blabla')
        .fill('hatarido', '2015.11.01.')
        .pressButton('button[type=submit]')
        .then(function() {
            browser.assert.redirected();
            browser.assert.success();
            browser.assert.url({ pathname: '/errors/list' });
            
            browser.assert.text('table.table tbody tr:last-child td:nth-child(3) span.label', 'Új');
            browser.assert.text('table.table tbody tr:last-child td:nth-child(4) ', '2015.11.01.');
            browser.assert.text('table.table tbody tr:last-child td:nth-child(5)', 'zh');  
            //done();
        });
    });
});


