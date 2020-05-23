const app = require("./app")
const http = require("http")

const PORT = 3001
app.listen(PORT, ()=>{console.log(`app running on port ${PORT}`)})