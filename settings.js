module.exports = {
    root: __dirname,
    uploadFolder: __dirname + "/server/uploads/files/",
    serverFolder: __dirname + "/server/",
    clientFolder: __dirname + "/client/",
    routesFolder: __dirname + "/routes/",
    database: {
        development: 'mongodb://localhost/monitoring',
        production: 'mongodb://localhost/monitoring-prod',
        test: 'mongodb://localhost/monitoring-test'
    }
};