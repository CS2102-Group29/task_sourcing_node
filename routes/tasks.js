const dbClient = require('../app').dbClient;

const { Router } = require('express');
const router = Router();

// list all tasks
router.get('/', (req, res) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });

    let query = 'SELECT * FROM tasks';

    if (req.query.email) {
        query += ` WHERE taskee_email = '${req.query.email}'`
    }

    dbClient.query(query)
        .then(dbres => res.json({ success: true, data: dbres.rows }))
        .catch(err => res.json({ success: false, err: err }));
});

// get a single task based on id
router.get('/:id', (req, res) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(`SELECT * FROM tasks WHERE id = ${req.params.id}`)
        .then(dbres => res.json({ success: true, data: dbres.rows[0] }))
        .catch(err => res.json({ success: false, err: err }));
});

// create task
router.post('/new', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.date;
    var time = req.body.time;
    const location = req.body.location;
    const taskee_email = req.body.taskee_email;
    const expiry_date = req.body.expiry_date;

    res.header({ 'Access-Control-Allow-Origin': '*' });

    var currentMaxId = 0;
    dbClient.query('SELECT MAX(id) FROM tasks').then(idres => {
        currentMaxId = idres.rows[0].max;

        dbClient.query(`INSERT INTO tasks VALUES (
                            ${currentMaxId + 1}, '${title}', '${description}', '${date}',
                            '${time}', '${location}', '${taskee_email}', '${expiry_date}')`)
                .then(dbres => res.json({ success: true, data: req.body }))
                .catch(err => res.json({ success: false, err: err }));
    });
});

module.exports = router;
