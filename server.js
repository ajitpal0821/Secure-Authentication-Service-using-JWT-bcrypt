require('dotenv').config()

const express = require('express');
const app = express()

const jwt = require('jsonwebtoken')
const users = require('./user')
const bcrypt = require('bcrypt')
app.use(express.json())

app.get('/posts', authToken, (req, res) => {
    res.send('<h1>Welcome</h1>')
})
app.get('/users', (req, res) => {
    res.json(users)
})
app.post('/login', async (req, res) => {

    try {
        const {username,password} = req.body;
        const user = users.find(user => user.name === username)
        if(!user){
            return res.status(401).json({Error:"Invalid Credentials"})
        }
        const isMatch=await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ Error: "Invalid Credentials" })
        }
        res.json("Login Successful")
    } catch {
       return res.status(500).send()
    }

})


function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403)
        req.user = user;
        next()
    })

}

app.listen(3000, () => {
    console.log("App Listening at port 3000")
})