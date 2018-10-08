const dbClient = require('../app').dbClient;

const { Router } = require('express');
const router = Router();

// list all tasks
router.get('/', (req, res) => {
    dbClient.query('SELECT * FROM tasks')
        .then(dbres => res.json({ success: true, data: dbres }))
        .catch(err => res.json({ success: false, err: err }));
});

// create task
router.post('/new', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const date = req.body.date;
    const time = req.body.time;
    const location = req.body.location;
    const taskee_email = req.body.taskee_email;
    const expiry_date = req.body.expiry_date;

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