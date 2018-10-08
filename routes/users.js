const dbClient = require('../app').dbClient;

const { Router } = require('express');
const router = Router();

const { UNIQUE_VIOLATION } = require('pg-error-constants')

// list all users
router.get('/', (req, res) => {
    dbClient.query('SELECT * FROM users', (err, dbres) => {
        if(err) {
            res.json({ success: false, err: err });
        } else {
           res.json({ success: true, data: dbres.rows });
        }
    });
});

// create user
router.post('/new', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const mobile = req.body.mobile;

    dbClient.query(`INSERT INTO users VALUES (
                        '${email}', '${password}', '${name}',
                        '${mobile}', NULL);`, (err, dbres) => {
                            if(err && err.code === UNIQUE_VIOLATION) {
                                res.header({ 'Access-Control-Allow-Origin': '*' });
                                res.json({ success: false, msg: "User with the specified email already exists." })
                            } else {
                                res.json({ success: true, data: req.body });
                            }
                        });
});

module.exports = router;