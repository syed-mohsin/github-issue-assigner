const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 6001

app.use(bodyParser.json())

app.get('/', (req, res) => res.json({
	test: 1,
}))

app.post('/', (req, res) => {
	const action = req.body.action
	const { id, number } = req.body.issue

	const payload = {
		success: true,
		action: action,
		issueId: id,
		issueNumber: number,
	}

	res.json(payload)
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}!`)
})
