const express = require('express');
const route = express.Router();

const competanceControllers = require('../controllers/competance')

const {check} = require('express-validator')



route.post('/ajout',
check('titre')
.not()
.isEmpty(),
check('niveau')
.not()
.isEmpty()
,competanceControllers.ajoutCompetance)

route.get('/',competanceControllers.getCompetance)
route.get('/:id',competanceControllers.getCompetanceById)

route.patch('/:id',
check('titre')
.not()
.isEmpty(),
check('niveau')
.not()
.isEmpty()
,competanceControllers.updateCompetance)


route.delete('/:id',competanceControllers.deleteCompetance)

route.get('/codidat/:id',competanceControllers.getCompetenceByCondidatId)





module.exports = route