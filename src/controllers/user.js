const mysql = require('mysql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// const dotenv = require('dotenv')

// dotenv.config()

// connect to db
const db = mysql.createConnection({
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

// Register new user
exports.register = (req, res) => {
    try{
        console.log("register req.body: ", req.body)
        const {username, password} = req.body

        // check if user already exists or not
        db.query('select username from users where username=?', [username], async (error, results)=>{
            if(error){
                console.log("error in register function at select:", error)
                return res.status(400).send({msg:"error in register function at select"})
            }
            else if(results.length > 0){
                return res.status(400).send({msg: "Username already exists!"})
            }

            let hashedPassword = await bcrypt.hash(password, 8)

            // insert user details into db
            db.query('insert into users set ?', {username: username, password: hashedPassword}, (error, results)=>{
                if(error){
                    console.log("error in register function at insert: ", error)
                    return res.status(400).send({msg:"error in register function at insert"})
                }
                else{
                    return res.status(200).send({msg: "User registered Successfully!"})
                }
            })
        })
    }catch(e){
        console.log("Error in register: ", e)
        return res.status(400).send({msg:"error in register function"})
    }
}
