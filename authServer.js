require('dotenv').config()

const express = require('express');
const app = express()

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')
const users = require('./user')

app.use(express.json())
let refresh_tokens = []

app.delete('/logout', (req, res) => {
    const token = refresh_tokens.filter(token => token !== req.body.refresh_token)
    res.sendStatus(204)
})

app.post('/token', (req, res) => {
    //to refresh access we need refresh token
    const refresh_token = req.body.refresh_token;
    if (!refresh_token)
        return res.sendStatus(401);

    if (!refresh_tokens.includes(refresh_token))
        return res.sendStatus(403);

    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        const access_token = generateAccessToken({ name: user.name })
        res.json({ access_token: access_token })
    })
})
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password
    try {
        if (!username || !password)
            return res.status(400).json({ error: "Username and Password Required" })
        const user = { name: username };

        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt);
        users.push({ name: username, password: hashpassword })
        console.log(users)

        //one first login we create access and refresh
        const access_token = generateAccessToken(user);
        const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

        refresh_tokens.push(refresh_token);
        res.json({ access_token: access_token, refresh_token: refresh_token })
    } catch {
        res.status(500).send()
    }
})
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.listen(4000, () => {
    console.log("Auth Server Listening at port 4000")
})