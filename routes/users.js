const dbClient = require('../app').dbClient;

const { Router } = require('express');
const router = Router();

// list all users
router.get('/', (req, res) => {
    dbClient.query('SELECT * FROM users')
        .then(dbres => res.json({ success: true, data: dbres.rows }))
        .catch(err => res.json({ success: false, err: err }));
});

// create user
router.post('/new', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const mobile = req.body.mobile;
    const image_url = req.body.image_url;

    dbClient.query(`INSERT INTO users VALUES (
                        '${email}', '${password}', '${name}',
                        '${mobile}', '${image_url}');`)
        .then(res.json({ success: true, data: req.body }))
        .catch(err => res.json({ success: false, err: err }));
});

module.exports = router;