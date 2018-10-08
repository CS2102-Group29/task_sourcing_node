const dbClient = require('../app').dbClient;

const { Router } = require('express');
const router = Router();

const { UNIQUE_VIOLATION } = require('pg-error-constants')

// list all users
router.get('/', (req, res) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query('SELECT * FROM users', (err, dbres) => {
        if(err) {
            res.json({ success: false, err: err });
        } else {
           res.json({ success: true, data: dbres.rows });
        }
    });
});

// get one user
router.get('/:email', (req, res) => {
    const email = req.params.email;

    res.header({'Access-Control-Allow-Origin': '*'});

    dbClient.query(`SELECT * FROM users WHERE email = '${email}'`, (err, dbres) => {
        if (!err) {
            res.json({success: true, data: dbres.rows});
        } else {
            res.json({success: false});
        }
    });
})

// create user
router.post('/new', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const mobile = req.body.mobile;

    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(`INSERT INTO users VALUES (
                        '${email}', '${password}', '${name}',
                        '${mobile}', NULL);`, (err, dbres) => {
                            console.log(err);
                            if(err && err.code === UNIQUE_VIOLATION) {
                                res.json({ success: false, msg: "User with the specified email already exists." })
                            } else {
                                res.json({ success: true, data: req.body });
                            }
                        });
});

// update user
router.post('/update/email/:email', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const mobile = req.body.mobile;
    const image_url = req.body.image_url;

    const old_email = req.params.email;

    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(`UPDATE users 
                    SET email = '${email}', password = '${password}', name = '${name}',
                        mobile = '${mobile}', image_url = '${image_url}'
                    WHERE email = '${old_email}'`, (err, dbres) => {
                        if(err && err.code === UNIQUE_VIOLATION) {
                            res.json({ success: false, msg: "User with the specified email already exists." })
                        } else {
                            res.json({ success: true, data: req.body });
                        }
                    })
});

// authenticate user (check email exists and password is correct)
router.post('/authenticate', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(`SELECT COUNT(*) FROM users 
                    WHERE email = '${email}' AND password = '${password}'`, (err, dbres) => {
                        if(dbres.rows[0].count === "1") {
                            res.json({ success: true, email: email });
                        } else {
                            res.json({ success: false, msg: "The combination of email and password does not exist."})
                        }
                    });
});

module.exports = router;