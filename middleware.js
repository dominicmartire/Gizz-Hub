const bodyParser = require('body-parser')

module.exports = (req, res, next) => {
    bodyParser.json({limit: '15mb', extended: true})
    bodyParser.urlencoded({limit: '15mb', extended: true})
    next()
}