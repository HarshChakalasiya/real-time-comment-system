const express = require('express')
const app = express()

const port = process.env.PORT || 3000

const dbConnect = require('./db')

app.use(express.static('public'))


dbConnect()


const Comment = require('./models/comment')

app.use(express.json())
// routes

app.post('/api/comments', (req,res)=>{
	const comment = new Comment({
		username: req.body.username,
		comment: req.body.comment
	})

	comment.save().then(response =>{
		res.send(response)
	})
})


app.get('/api/comments',(req,res)=>{
	Comment.find().then(comments => {
		res.send(comments)
	})
})


const server = app.listen(port, ()=>{
	console.log(`Listen on port ${port}`)
})


let io = require('socket.io')(server)

io.on('connection',(socket)=>{	
	// console.log(`New connection ${socket.id}`)
	// Receive event

	socket.on('comment',(data)=>{
		
		data.time = Date()    // change time from server
		socket.broadcast.emit('comment', data)
	})

	socket.on('typing', (data)=>{
		socket.broadcast.emit('typing',data)
	})
})