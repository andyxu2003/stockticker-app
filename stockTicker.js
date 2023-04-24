// app.js
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

const uri = 'mongodb+srv://xuandy2003:Ilovemonicamimi2003@cluster0.eoymx0c.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.urlencoded({ extended: true })) // use middleware to parse form data

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/form.html') // serve the HTML file
})

app.post('/process', async (req, res) => {
  const inputType = req.body['input-type'] // get the value of the input type radio button
  const inputField = req.body['input-field'] // get the value of the input field

  try {
    await client.connect() // connect to the MongoDB Atlas cluster
    const database = client.db('companiesList') // select the database
    const collection = database.collection('companies') // select the collection
    let query = {}
    if (inputType === 'symbol') {
      query = { ticker: inputField.toUpperCase() } // look up the company by its stock ticker symbol
    } else {
      query = { name: inputField } // look up the company by its name
    }
    const companies = await collection.find(query).toArray() // execute the query
    if (companies.length > 0) {
      let output = ''
      for (let i = 0; i < companies.length; i++) {
        output += `Company: ${companies[i].name}, Ticker Symbol: ${companies[i].ticker}, Price: ${companies[i].price}<br>` // display the data
      }
      res.send(output)
    } else {
      res.send('Company not found.') // handle the case when the company is not found
    }
  } catch (err) {
    console.error(err)
  } finally {
    await client.close() // close the connection to the MongoDB Atlas cluster
  }
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
