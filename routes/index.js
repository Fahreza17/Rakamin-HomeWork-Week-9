const express = require('express')
const router = express.Router()
const { User, Movie } = require('../models')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const jwt = require('jsonwebtoken')
const SECRET_KEY = "SECRET_KEY"

const { authentication, authorization } = require('../middlewares/auth.js')

//User

//Register
router.post("/register", async (req, res, next) => {

    const { username, email, password } = req.body
    const hashPassword = bcrypt.hashSync(password, salt)

    const createdUser = await User.create({
        username,
        email,
        password: hashPassword
    }, { returning: true })


    res.status(201).json(createdUser)
})

//Login
router.post("/login", async (req, res, next) => {
    try {

        const { email, password } = req.body

        const foundUser = await User.findOne({
            where: {
                email
            }
        })

        if (foundUser) {

            const comparePassword = bcrypt.compareSync(password, foundUser.password)

            if (comparePassword) {

                const accessToken = jwt.sign({
                    email: foundUser.email,
                    username: foundUser.username
                }, SECRET_KEY)

                res.status(200).json({
                    message: "Login Successfully",
                    data: {
                        email: foundUser.email,
                        username: foundUser.username,
                        accessToken
                    }
                })

            } else {
                throw { name: "InvalidCredentials" }
            }

        } else {
            throw { name: "InvalidCredentials" }
        }

    } catch (err) {
        next(err)
    }
})

router.use(authentication)

//Get All Users
router.get("/showUser", async(req, res, next) => {
    try {
        const {page, size} = req.query

        const user = await User.findAndCountAll({
            limit : size,
            offset : page * size
        })

        res.status(200).json(user)
        
    } catch (err) {
        next(err)
    }
})

//Update User
router.put("/updateUser/:id", authorization, async(req, res, next) => {
    try {
        const {id} = req.params
        const {username, email, password} = req.body
        const hashPassword = bcrypt.hashSync(password, salt)

        const foundUser = await User.findOne({
            where : {
                id
            }
        })
        console.log(foundUser)

        if (foundUser) {

            const updateUser = await foundUser.update({
                username : username || foundUser.username,
                email : email || foundUser.email,
                password : hashPassword || foundUser.password
            }, {returning : true})

            res.status(200).json({
                message : "Update User Successfully",
                data : updateUser
            })
            
        } else {
            throw {name : "ErrorNotFound"}
        }
        
    } catch (err) {
        next(err)
    }
})

//Delete User
router.delete("/deleteUser/:id", authorization, async(req, res, next) => {
    try {
        const {id} = req.params

        const foundUser = await User.findOne({
            where : {
                id
            }
        })

        if (foundUser) {
            await foundUser.destroy()

            res.status(200).json({message : "User Deleted Successfully"})
            
        } else {
            throw {name : "ErrorNotFound"}
        }

    } catch (err) {
        next(err)
    }
})


//Movie

//Create
router.post("/addMovie", async (req, res, next) => {
    try {
        const { title, producer, description, release_year } = req.body

        const { id } = req.loggedUser

        const movie = await Movie.create({
            title,
            producer,
            description,
            release_year,
            user_id: id
        }, { returning: true })

        res.status(201).json({
            message: "Movie Added",
            data: movie
        })


    } catch (err) {
        next(err)
    }
})

//Get All Movies
router.get("/showMovie", async (req, res, next) => {
    try {
        const {page, size} = req.query

        const movie = await Movie.findAndCountAll({
            limit : size,
            offset : page * size
        })

        res.status(200).json(movie)

    } catch (err) {
        next(err)
    }
})

//Movie Detail
router.get("/showMovie/:id", async (req, res, next) => {
    try {
        const { id } = req.params

        const foundMovie = await Movie.findOne({
            where: {
                id
            },
            include: {
                model: User
            }
        })

        if (foundMovie) {
            res.status(200).json(foundMovie)

        } else {
            throw { name: "ErrorNotFound" }
        }
    } catch (err) {
        next(err)
    }
})

//Update Movie
router.put("/updateMovie/:id", authorization, async(req, res, next) => {
    try {
        const {id} = req.params
        const { title, producer, description, release_year } = req.body

        const foundMovie = await Movie.findOne({
            where : {
                id
            }
        })

        if (foundMovie) {
            
            const updatedMovie = await foundMovie.update({
                title : title || foundMovie.title,
                producer : producer || foundMovie.producer,
                description : description || foundMovie.description,
                release_year : release_year || foundMovie.release_year
            }, {returning : true})

            res.status(200).json({
                message : "Update Movie Successfully",
                data : updatedMovie
            })

        } else {
            throw { name: "ErrorNotFound" }
        }
        
    } catch (err) {
        next(err)
    }
})

//delete
router.delete("/deleteMovie/:id", authorization, async(req,res,next) => {
    try {
        const {id} = req.params

        const foundMovie = await Movie.findOne({
            where : {
                id
            }
        })

        if (foundMovie) {
            await foundMovie.destroy()

            res.status(200).json({message : "Movie Deleted Successfully"})
            
        } else {
            throw {name : "ErrorNotFound"}
        }

    } catch (err) {
        next(err)
    }
})


module.exports = router;