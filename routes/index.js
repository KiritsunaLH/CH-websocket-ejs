let userApi = require('../components/users/index.js')

module.exports = (app)=>{
    userApi(app)
    app.get("/", (req, res, next) =>{
    res.render("index",{});
    }) 
}