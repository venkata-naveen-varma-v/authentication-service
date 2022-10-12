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

// User login
exports.auth = async (req, res, next) => {
    console.log("In auth middleware")
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        
        // verify the token using the access key
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, decoded)=>{
            if(err){
                return res.status(401).send({msg: 'Please authenticate.'})
            }
            // get user details for further use
            db.query('select id,username from users where token=?', [token], async (error, results)=>{
                if(error){
                    console.log("error in auth function at select:", error)
                    return res.status(400).send({msg:"error in auth function at select"})
                }
                else if(results.length == 0){
                    return res.status(401).send({msg: "Invalid Token! Try logging In!!"})
                }else{
                    req.userdetails = results[0]
                    next()
                }
            })
        })
    }
    catch(e){
        console.log("Error: ", e)
        res.status(401).send({ msg: 'Please authenticate.' })
    }
}

// const auth = async (req, res, next) => {
//     try {
//         const token = req.header('Authorization').replace('Bearer ', '')
//         const decoded = jwt.verify(token, 'thisismynewcourse')
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

//         if (!user) {
//             throw new Error()
//         }

//         req.user = user
//         next()
//     } catch (e) {
//         res.status(401).send({ error: 'Please authenticate.' })
//     }
// }
