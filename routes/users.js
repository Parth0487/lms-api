var express = require('express');
const db = require('../utils/db');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async function (req, res, next) {
  try {
    let query = `
      SELECT 
      u.userId,
      u.name,
      u.email,
      u.userType,

      ut.userTypeName,
      ut.userTypeCode

      FROM users u

      LEFT JOIN userType ut ON ut.userTypeId = u.userType

      WHERE email = '${req.body.email}'

    `;

    let user = await db.customQuery(query);

    if (user && user.length) {
      res.json({ user: user && user[0] ? user[0] : {}, status: 200, success: true });
    } else {
      res.json({ user: {}, success: false });
    }
  } catch (error) {
    res.json(error);
  }
});

router.post('/', async function (req, res, next) {
  try {
    let user = {};
    user = await db.addRecord('users', req.body);

    res.json({ user, success: true });
  } catch (error) {
    res.json(error);
  }
});

router.put('/', async function (req, res, next) {
  try {
    const { name, email, userId } = req.body;

    let data = {
      name,
      email,
    };

    let where = {
      userId,
    };

    let user = await db.updateRecord('users', data, where);
    res.json({ user, success: true });
  } catch (error) {
    res.json(error);
  }
});

router.get('/get-user-by-id/:id', async function (req, res, next) {
  try {
    const { id: userId } = req.params;

    let where = {
      userId,
    };

    let user = await db.getRecords('users', where);
    res.json({ user: user && user.length ? user[0] : {}, success: true });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
