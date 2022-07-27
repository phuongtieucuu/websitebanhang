var express = require('express')
const producttypeController = require('../app/controllers/producttypeController')
var router = express.Router()
router.get('/:id/update',producttypeController.showupdate)
router.delete('/:id/delete',producttypeController.delete)
router.put('/:id',producttypeController.update)
router.get('/add',producttypeController.add)
router.post('/add',producttypeController.postadd)
router.get('/',producttypeController.show)


module.exports = router