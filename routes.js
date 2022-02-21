'use strict';

const HTTP_STATUS = require('./modules/constants/httpStatus'),
    auth = require('./modules/middleware/auth');


module.exports = app => {
    app.use((req, res, next) => {
        console.log("Request", req.url)
        if (req.url == "/terms_of_service") {
            res.sendFile(__dirname + '/modules/views/terms_of_service.html');
        } else if (req.url == "/privacy_policy") {
            res.sendFile(__dirname + '/modules/views/privacy_policy.html');
        } else if (req.url == "/about_us") {
            res.sendFile(__dirname + '/modules/views/about_us.html');
        } else {
            next();
        }
    });

    app.use('/api/v1/webhook', require('./modules/routes/Webhook'));
    app.use(auth.validateApiKey);
    app.use('/api/v1/user', require('./modules/routes/Users'));
    app.use('/api/v1/friends', require('./modules/routes/Friends'));
    app.use('/api/v1/stripe', require('./modules/routes/Stripe'));
    app.use('/api/v1/wallet', require('./modules/routes/Wallet'));
    app.use('/api/v1/notification_details', require('./modules/routes/Notification_details'));
    app.use('/api/v1/recharges', require('./modules/routes/Recharges'));
    /**
     * Throw 404 for all other routes.
     */
    app.use((req, res, next) => {

        /**
         * Header sent will be false if none of the above routes matched.
         */
        if (res._headerSent) {
            return next();
        }

        /**
         *  Else, throw 404
         */
        res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'This route doesn\'t exist' });
    });
};