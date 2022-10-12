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

// User login
exports.login = async (req, res) => {
    try{
        console.log("login req.body:", req.body)
        const {username, password} = req.body
        // get user password to verify
        db.query('select password from users where username=?', [username], async (error, results)=>{
            if(error){
                console.log("error in register function at select:", error)
                return res.status(400).send({msg:"error in register function at select"})
            }
            else if(results.length == 0){
                return res.status(401).send({msg: "Invalid username! Try again!!"})
            }else{
                // compare hashedPassword
                let hashedPassword = results[0].password 
                let password_correct = await bcrypt.compare(password, hashedPassword)
                if(password_correct){
                    // Generate jwt token
                    const access_token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET)
                    // Insert jwt token details into db
                    db.query('update users set token=? where username=?', [access_token, username], (error, results)=>{
                        if(error){
                            console.log("error in login function at insert: ", error)
                            return res.status(400).send({msg:"error in users function at insert"})
                        }else{
                            console.log("Token insertion successfull!")
                        }
                    })
                    // send jwt token
                    return res.status(200).send({token: access_token, msg:"User loggedIn!"})
                }else{
                    return res.status(401).send({msg: "Invalid Password! Try again!"})
                }
            }
        })
    }catch(e){
        console.log("Error in login: ", e)
        return res.status(400).send({msg:"error in login function"})
    }
}

// get userdetails
exports.userdetails = (req, res) => {
    try{
        console.log("userdetails: ", req.userdetails)
        const user_details = req.userdetails
        return res.status(200).send(user_details)
    }catch(e){
        console.log("Error in userdetails: ", e)
        return res.status(400).send({msg:"error in userdetails function"})
    }
}

// User logout
exports.logout = async (req, res) => {
    try{
        console.log("logout req.userdetails:", req.userdetails)
        const user_details = req.userdetails
        // remove token
        db.query('update users set token=? where id=?', [null, user_details.id], (error, results)=>{
            if(error){
                console.log("error in logout function at insert: ", error)
                return res.status(400).send({msg:"error in users function at update"})
            }else{
                console.log("User logged out!")
                return res.status(200).send({msg:"User logged out!"})
            }
        })
    }catch(e){
        console.log("Error in logout: ", e)
        return res.status(400).send({msg:"error in logout function"})
    }  
}
