module.exports.isLoggedIn=(req,res,next)=>{
    // console.log("Req.user..",req.user);
    
    if(!req.isAuthenticated())
        {
            req.session.returnTo=req.originalUrl;

            req.flash('error','You must Sign in first!!')
           return  res.redirect('/login');
        }
        next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}