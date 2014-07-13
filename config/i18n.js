var i18n = require('i18n');
var settings = require("../settings");

i18n.configure({
    locales: ['en', 'fr'],
    directory: settings.dirname + '/locales',
    defaultLocale: 'en',
    cookie: 'locale'
});

var config = function(app) {
    app.use(i18n.init);

    app.use(function(req, res, next) {
        if (req.session.locale) {
            res.setLocale(req.session.locale);
        }
        next();
    });
};


module.exports = config;