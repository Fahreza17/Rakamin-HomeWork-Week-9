const express = require('express')
const app = express()
const port = 3000
const router = require('./routes')
const errorHandler = require('./middlewares/errorHandler.js')
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./ApiDocumentation.json')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(morgan("tiny"))

app.use(express.json())

app.use(router)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})