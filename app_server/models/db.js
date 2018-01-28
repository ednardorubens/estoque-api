var conn, mongoose = require('mongoose');

module.exports = (() => {
    var connect = (uri, options) => {
        conn = mongoose.createConnection(uri, options);
        
        conn.on('connected', () => {
            console.log('Mongoose connected to ' + uri);
        });
        
        conn.on('error', (error) => {
            console.log('Mongoose connection error: ' + error);
        });
        
        conn.on('disconnected', () => {
            console.log('Mongoose disconnected of ' + uri);
        });
        
        var gracefulShutdown = (msg, callback) => {
            conn.close(() => {
                console.log('Mongoose disconnected through ' + msg);
                callback();
            });
        };
        
        process.once('SIGUSR2', () => {
            gracefulShutdown('nodemon restart', () => {
                process.kill(process.pid, 'SIGUSR2');
            });
        });
        
        process.on('SIGINT', () => {
            gracefulShutdown('app termination', () => {
                process.exit(0);
            });
        });
    
        process.on('SIGTERM', () => {
            gracefulShutdown('Heroku termination', () => {
                process.exit(0);
            });
        });
    }

    return {
        connect: (uri, options) => connect(uri, options),
    };
})();