const express = require('express');
const route = express.Router();

const experienceControllers = require('../controllers/experience')

const {check} = require('express-validator')



route.post('/ajout',
check('poste')
.not()
.isEmpty(),
check('employeur')
.not()
.isEmpty(),
check('ville')
.not()
.isEmpty(),
check('Ddebut')
.not()
.isEmpty(),
check('Dfin')
.not()
.isEmpty(),
check('description')
.not()
.isEmpty()
,experienceControllers.ajoutExperience)

route.get('/',experienceControllers.getExperience)
route.get('/:id',experienceControllers.getExperienceById)

route.patch('/:id',
check('poste')
.not()
.isEmpty(),
check('employeur')
.not()
.isEmpty(),
check('ville')
.not()
.isEmpty(),
check('Ddebut')
.not()
.isEmpty(),
check('Dfin')
.not()
.isEmpty(),
check('description')
.not()
.isEmpty()
,experienceControllers.updateExperience)


route.delete('/:id',experienceControllers.deleteExperience)




module.exports = route