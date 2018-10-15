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
                        '${task_id}', '${bidder_email}', '${bid}', FALSE);`, (err, dbres) => {
                            console.log(err);
                            if (err) {
                                res.json({ success: false });
                            } else {
                                res.json({ success: true, data: req.body });
                            }
                        }
    );
});

module.exports = router;
