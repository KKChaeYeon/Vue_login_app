const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const jwtKey = "abcdefg1234";

const members = [
    {
        id: 3,
        name: "도서관",
        loginId: "lib",
        loginPw: "africa"
    },
    {
        id: 4,
        name: "채연",
        loginId: "a",
        loginPw: "1"
    }
]

app.use(cookieParser());
app.use(bodyParser.json());

//개정 정보 가져오기
app.get('/api/account', (req, res) => {
    //console.log(req.cookies);

    if(req.cookies && req.cookies.token){
        jwt.verify(req.cookies.token, jwtKey, (err, decoded) => {
            if(!err){
                return res.send(decoded);
            }
            return res.send(401);
        })
    }else{
        res.sendStatus(401);
    }
})

app.post('/api/account', (req, res) => {
    const loginId = req.body.loginId;
    const loginPw = req.body.loginPw;

    const member = members.find(m=> m.loginId === loginId && m.loginPw === loginPw);

    if(member){
        const options = {
            domain: "localhost",
            path: "/",
            httpOnly: true
        };

        const token = jwt.sign({
            id: member.id,
            name: member.name,
        }, jwtKey, {
            expiresIn: "15m",
            issuer: "chaeyeon"
        });

        res.cookie("token", token, options);
        res.send(member);
    }else{
        res.sendStatus(404);
    }
});

app.delete('/api/account', (req, res) => {
    if(req.cookies && req.cookies.token){
        res.clearCookie("token");
    }
    res.sendStatus(200);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});