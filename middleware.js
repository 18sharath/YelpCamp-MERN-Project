module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
        {
            req.flash('error','You must Sign in first!!')
           return  res.redirect('/login');
        }
        next();
}