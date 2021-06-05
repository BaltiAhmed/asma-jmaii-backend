const express = require('express');
const route = express.Router();

const offreControllers = require('../controllers/offre')

const {check} = require('express-validator')



route.post('/ajout',
check('titre')
.not()
.isEmpty(),
check('Ddebut')
.not()
.isEmpty(),
check('Dfin')
.not()
.isEmpty(),
check('mission')
.not()
.isEmpty(),
check('Aprincipale')
.not()
.isEmpty(),
check('description')
.not()
.isEmpty()
,offreControllers.ajoutOffre)

route.get('/',offreControllers.getOffre)
route.get('/:id',offreControllers.getOffreById)
route.get('/user/:id',offreControllers.getOffreByUserId)

route.patch('/:id',
check('titre')
.not()
.isEmpty(),
check('Ddebut')
.not()
.isEmpty(),
check('Dfin')
.not()
.isEmpty(),
check('mission')
.not()
.isEmpty(),
check('Aprincipale')
.not()
.isEmpty(),
check('description')
.not()
.isEmpty()
,offreControllers.updateOffre)

route.delete('/:id',offreControllers.deleteOffre)




module.exports = route