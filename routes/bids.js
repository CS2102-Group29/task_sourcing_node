const dbClient = require('../app').dbClient;

const { Router } = require('express');
const router = Router();

// create bid
router.post('/new', (req, res) => {
    const task_id = req.body.task_id;
    const bidder_email = req.body.bidder_email;
    const bid = req.body.bid;

    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(`INSERT INTO bid_task VALUES (
                        '${task_id}', '${bidder_email}', '${bid}', 'ongoing')
                        ON CONFLICT (task_id, bidder_email) DO UPDATE SET bid = excluded.bid;`, (err) => {
                            if (err) {
                                res.json({ success: false, msg: 'Failed to record your bid.', err: err });
                            } else {
                                res.json({ success: true, msg: 'Your bid has been recorded. Bid 0 to withdraw bid.' });
                            }
                        }
    );
});

// get a single bidding data based on task_id and bidder_email
router.get('/:id/:email', (req, res) => {
    const task_id = req.params.id;
    const bidder_email = req.params.email;

    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(`SELECT * FROM bid_task
                    WHERE task_id = ${task_id} AND bidder_email = '${bidder_email}'`)
        .then(dbres => res.json({ success: true, data: dbres.rows[0] }))
        .catch(err => res.json({ success: false, err: err}));
});

// get all bids
router.get('/', (req, res) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });

    let query = 'SELECT * FROM bid_task';
    if (req.query.task_id) {
        query += ` WHERE task_id = ${req.query.task_id}`
    }

    dbClient.query(query)
        .then(dbres => res.json({ success: true, data: dbres.rows }))
        .catch(err => res.json({ success: false, err: err}));
});

// accept the bid
router.get('/accept/:task_id/:bidder_email', (req, res) => {
    const task_id = req.params.task_id;
    const bidder_email = req.params.bidder_email;
    const query = `UPDATE bid_task SET status = 'success'
                WHERE bidder_email = '${bidder_email}' AND task_id = ${task_id};
                UPDATE bid_task SET status = 'fail'
                WHERE bidder_email <> '${bidder_email}' AND task_id = ${task_id};`

    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(query, (err) => {
        if (err) {
            res.json({ success: false, err: err });
        } else {
            res.json({ success: true, data: req.body });
        }
    });
});

// get successful / ongoing / unsuccessful bids
router.get('/:email/status/:status', (req, res) => {
    const email = req.params.email;
    const status = req.params.status; // status should be 'success', 'ongoing' or 'fail'

    res.header({ 'Access-Control-Allow-Origin': '*' });

    dbClient.query(`SELECT t1.title AS task, t1.id, u1.name AS taskee_name, u1.email, bt1.bid AS your_bid, mb1.min_bid AS lowest_bid
                    FROM tasks t1
                    INNER JOIN users u1 ON u1.email = t1.taskee_email
                    INNER JOIN bid_task bt1 ON t1.id = bt1.task_id
                    CROSS JOIN (
                        SELECT bt2.task_id AS task_id, MIN(bt2.bid) as min_bid
                        FROM bid_task bt2
                        GROUP BY bt2.task_id
                    ) AS mb1
                    WHERE mb1.task_id = bt1.task_id AND bt1.bidder_email = '${email}' AND bt1.status = '${status}'`, (err, dbres) => {
                        if(err) {
                            res.json({ success: false, msg: err });
                        } else {
                            res.json({ success: true, data: dbres.rows });
                        }
                    });

});

module.exports = router;
