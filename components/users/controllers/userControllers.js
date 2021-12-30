class User{
    async init(req,res,next){
        try {
            res.render('index',{})
        } catch (error) {
            console.log('Error...', error);
        }
    }
}

module.exports = new User();