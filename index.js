'use strict'
require('dotenv').config({ silent: true })
const Spreadsheet = require('google-spreadsheet')
const doc = new Spreadsheet(process.env.GOOGLE_SHEETS_ID)

function auth(){
	return new Promise((resolve, reject) => {
		console.log('Spreadsheet auth...')
		doc.useServiceAccountAuth({
			client_email: process.env.GOOGLE_SHEETS_API_EMAIL,
			private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n')
		}, err => {
			if(err) reject(err)
			else resolve()
		})
	})
}
function getWorksheet(){
	return new Promise((resolve, reject) => {
		console.log('Getting spreadsheet info...')
		doc.getInfo((err, info) => {
			if(err) return reject(err)
			resolve(info.worksheets[0])
		})
	})
}
function getData(sheet){
	return new Promise((resolve, reject) => {
		console.log('Getting spreadsheet data...')
		const brands = {}
		sheet.getCells({}, (err, rows) => {
			if(err) return reject(err)
			let email
			rows.forEach(row => {
				if(row.col === 1){
					email = row._value
				}
				else{
					if(!(row._value in brands)){
						brands[row._value] = []
					}
					const brand = brands[row._value]
					if(email && brand.indexOf(email) === -1){
						brand.push(email)
					}
				}
			})
			resolve(brands)
		})
	})
}

module.exports = () => {
	return auth()
		.then(getWorksheet)
		.then(getData)
}