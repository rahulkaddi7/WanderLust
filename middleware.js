const Listing = require("./models/listing");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "Login to continue");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRediectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params; 
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You dont have the permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}