let username
let socket = io()

do{
	username = prompt('Enter your name: ')
}while(!username)

const textarea = document.querySelector('#textarea')
const submitBtn = document.querySelector('#submitBtn')

const comment_box= document.querySelector('.comment_box')

submitBtn.addEventListener('click',(event)=>{
	event.preventDefault()
	let comment = textarea.value;

	if(!comment){
		return 
	}
	postComment(comment)
}) 

function postComment(comment){
	// Append to dom
	let data ={
		username: username,
		comment: comment
	}
	appendToDom(data)
	textarea.value=""
	
	// Broadcast

	broadcastComment(data)
	
	// Store to db
	syncWithDb(data)

}

function appendToDom(data){


	let lTag = document.createElement('li')

	lTag.classList.add('comment','mb-4')

	let markUp = `
					<div class="card border-light mb-3">
						<div class="card-body">
							<h6>${data.username}</h6>
							<p>${data.comment}</p>
							<div>
								<img src="/img/clock.png" alt="clock">
								<small>${moment(data.time).format('LT')}</small>
							</div>
						</div>
					</div>
	`

	lTag.innerHTML = markUp
	comment_box.prepend(lTag)
}

function broadcastComment(data){
	// Socket
	socket.emit('comment',data)

}

socket.on('comment',(data)=>{
	appendToDom(data)
})


let timerId = null 
function deBounce(func, timer){
	
	if(timerId){
		clearTimeout(timerId)
	}
	timerId = setTimeout(()=>{
		func()
	},timer)
}


let typingDiv = document.querySelector('.typing')
socket.on('typing',(data)=>{
	typingDiv.innerText = `${data.username} is typing...`


	// De Bounce 
	deBounce(function(){
		typingDiv.innerText = ''
	},1000)
	
})

// Event listener on text area

textarea.addEventListener('keyup',(e)=>{
	socket.emit('typing', { username: username })
})



// Api calls
function syncWithDb(data){
	const headers = {
		'Content-Type': 'application/json'
	}
	fetch('/api/comments', {
		method : 'Post',
		body: JSON.stringify(data),
		headers 
	}).then(response=>{
		response.json()
	}).then(result=>{
		console.log(result)
	})
}


function fetchComments(){
	fetch('/api/comments').then(res=>
		res.json()
	).then(result=>{
		result.forEach((comment)=>{
			comment.time = comment.createdAt
			appendToDom(comment)
		})
		
		console.log(result)
	})
}

window.onload = fetchComments