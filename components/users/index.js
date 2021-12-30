let {Router} = require('express')
let router = new Router()
let userController = require('./controllers/userControllers')
module.exports=(app)=>{
    app.use('/users', router)
    router.get('./', userController.init)
}