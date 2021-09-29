const express = require('express');
const router = express.Router();
const indexCon = require('../controllers/indexController');

router.all('/', indexCon.home_get);

router.get('/gallery', indexCon.gallery_get);

router.get('/tools', indexCon.tools_get);

router.post('/cc', indexCon.data_get);

router.post('/cp-add', indexCon.cp_add);
router.post('/cp-remove', indexCon.cp_remove);


module.exports = router;