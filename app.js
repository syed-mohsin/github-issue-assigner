const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require('axios')

const port = process.env.PORT || 6001

const ISSUES_API_ENDPOINT = 'https://api.github.com.com/repos/syed-mohsin/github-issue-assigner/issues'
axios.defaults.headers.post['Authorization'] = `token ${process.env.GITHUB_API_ACCESS_TOKEN}`

const USERNAMES = ['syed-mohsin']

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

	if (action === 'opened') {
		axios.post(`${ISSUES_API_ENDPOINT}/${number}/assignees`, {
			assignees: USERNAMES
		})
		.then(res => {
			console.log('res', res)
		})
		.catch(err => {
			console.log('err', err)
		})
	}

	res.json(payload)
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}!`)
	console.log('env', process.env.GITHUB_API_ACCESS_TOKEN)
})
