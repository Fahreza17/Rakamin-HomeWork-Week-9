const errorHandler = (err, req, res, next) => {
    console.log(err)

    if (err.name === "InvalidCredentials") {
        res.status(400).json({message : "Wrong Email or Password"})
    } else if (err.name === "Unauthenticated") {
        res.status(400).json({message : "Unaunthenticated"})
    } else  if (err.name === "JsonWebTokenError") {
        res.status(400).json({message : "Invalid Token"})
    }else if (err.name === "ErrorNotFound") {
        res.status(404).json({message : "Error Not Found"})
    }else if (err.name === "Unauthorized") {
        res.status(403).json({message : "Unauthorized"})
    }else if (err.name === "UnsupportedEntity") {
        res.status(400).json({message : "UnsupportedEntity"})
    }
    
    
    else {
        res.status(500).json({message : "Internal Server Error"})
    }

}

module.exports = errorHandler;