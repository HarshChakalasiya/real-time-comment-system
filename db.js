function dbConnect(){
	// Db Connection

const mongoose = require('mongoose')
const url = process.env.MONGO_CONNECTION_URL

mongoose.connect(url, {
	useNewUrlParser : true,
	useUnifiedTopology: true,
	useFindAndModify: true 
})

const connection = mongoose.connection

connection.once('open',()=>{
	console.log('Database connected')
}).catch((err)=>{
	console.log('Connection Failed...')
})
}

module.exports = dbConnect