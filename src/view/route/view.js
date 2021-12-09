const express = require('express');
const router = express.Router();
const path = require('path');
const dirHtml = __dirname + '/../html'
const dirCss = __dirname + '/../css'

router.get('/', function(req, res) {
    res.sendFile(path.resolve(dirHtml + '/home.html'));
});

router.get('/login', function(req, res) {
    if (req.cookies.access_token) {
        res.redirect('/');
    }
    else {
        res.sendFile(path.resolve(dirHtml + '/login.html'));
    }
});

router.get('/logout', function(req, res) {
    if (!req.cookies.access_token) {
        res.redirect('/');
    }
    else {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.clearCookie('login');
        res.redirect('/');
    }
});

router.get('/password', function(req, res) {
    if (!req.cookies.access_token) {
        res.redirect('/');
    }
    else {
        res.sendFile(path.resolve(dirHtml + '/changePassword.html'));
    }
});

router.get('/name', function(req, res) {
    if (!req.cookies.access_token) {
        res.redirect('/');
    }
    else {
        res.sendFile(path.resolve(dirHtml + '/changeName.html'));
    }
});
module.exports = router;