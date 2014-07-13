module.exports = {
    dirname: __dirname,
    uploadFolder: __dirname + "/uploads/files/",
    database: {
        development: 'mongodb://localhost/monitoring',
        production: 'mongodb://localhost/monitoring-prod',
        test: 'mongodb://localhost/monitoring-test'
    }
};