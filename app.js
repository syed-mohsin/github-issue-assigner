const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const port = process.env.PORT || 6001

const USERNAMES = ['syed-mohsin']
const ISSUES_API_ENDPOINT = 'https://api.github.com.com/repos/syed-mohsin/github-issue-assigner/issues'

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
		request({
			url: `${ISSUES_API_ENDPOINT}/${number}/assignees`,
			method: 'POST',
			headers: {
				Authorization: `token ${process.env.GITHUB_API_ACCESS_TOKEN}`,
			},
			json: { assignees: USERNAMES },
			// followAllRedirects: true,
		}, (err, response, body) => {
			console.log('error', err, 'status', response && response.statusCode, 'body', body)
		})
	}

	res.json(payload)
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}!`)
	console.log('env', process.env.GITHUB_API_ACCESS_TOKEN)
})
