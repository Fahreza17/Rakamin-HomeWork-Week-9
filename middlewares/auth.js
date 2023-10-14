const jwt = require('jsonwebtoken')
const SECRET_KEY = "SECRET_KEY"
const { User, Movie } = require('../models')

const authentication = async (req, res, next) => {
    try {

        if (!req.headers.authorization) {
            throw { name: "Unauthenticated" }
        }

        const token = req.headers.authorization.split(" ")[1]

        const decodeToken = jwt.verify(token, SECRET_KEY)

        const foundUser = await User.findOne({
            where: {
                email: decodeToken.email
            }
        })

        if (foundUser) {

            req.loggedUser = {
                id: foundUser.id,
                email: foundUser.email,
                username: foundUser.username
            }

            next()

        } else {
            throw { name: "Unauthenticated" }
        }

    } catch (err) {
        next(err)
    }
}

const authorization = async (req, res, next) => {
    try {
        const { id } = req.params;
        const loggedUser = req.loggedUser;

        // Cek apakah entitas yang diminta adalah User
        if (req.path.includes("User")) {
            if (parseInt(id, 10) === loggedUser.id) {
                next()

            } else {
                throw { name: "Unauthorized" }
            }
            
        } else if (req.path.includes("Movie")) {
            const foundMovie = await Movie.findOne({
                where: {
                    id: id
                }
            })

            if (foundMovie) {
                if (foundMovie.user_id === loggedUser.id) {
                    next()
                } else {
                    throw { name: "Unauthorized" }
                }
            } else {
                throw { name: "ErrorNotFound" }
            }
        } else {
            throw { name: "UnsupportedEntity" }
        }
    } catch (err) {
        next(err)
    }
};


module.exports = {
    authentication,
    authorization
}