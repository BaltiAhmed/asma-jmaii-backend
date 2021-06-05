const express = require('express');
const route = express.Router();

const entrepriseControllers = require('../controllers/entreprise')

const {check} = require('express-validator')

const fileUpload = require('../middleware/file-uploads')

route.post('/signup', 
fileUpload.single('image'),
[check('nom')
.not()
.isEmpty(),
check('nom_entreprise')
.not()
.isEmpty(),
check('site_web')
.not()
.isEmpty(),
check('tel')
.not()
.isEmpty(),
check(' adresse')
.not()
.isEmpty(),
check('description')
.not()
.isEmpty(),
check('secteur')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})]
,entrepriseControllers.signup)

route.post('/login', 
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
,entrepriseControllers.login)




route.get('/',entrepriseControllers.getEntreprise)

route.get('/:id',entrepriseControllers.getEntrepriseById)

route.delete('/:id',entrepriseControllers.deleteEntreprise)
route.patch('/:userId',
check('nom')
.not()
.isEmpty(),
check('nom_entreprise')
.not()
.isEmpty(),
check('site_web')
.not()
.isEmpty(),
check('tel')
.not()
.isEmpty(),
check(' adresse')
.not()
.isEmpty(),
check('description')
.not()
.isEmpty(),
check('secteur')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
,entrepriseControllers.updateEntreprise)




module.exports = route