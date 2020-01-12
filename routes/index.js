module.exports=function(app) {
    app.get('/',(req,res)=>{
        res.redirect('/posts')
    })
    app.use('/posts', require('./posts'))
    app.use('/signin', require('./signin'))
    app.use('/regist',require('./regist'))
    app.use('/user', require('./user'))
}