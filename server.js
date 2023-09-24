const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());
//MySQL connecttion
const connecttion = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'',
    database:'mysql_nodejs',
    port:'3306'
})
connecttion.connect((err)=>{
    if(err){
        console.log("=> Error! connecting to MySQL database = ",err);
    }else{
        console.log("=> MySql successfully connectes.");
    }
})
app.get("/",(req,res)=>{
    res.send("Run my API on port 3000")
})

// CREATE user
app.post("/create",async(req, res)=>{
    const{email, name, password} = req.body;

    try{
        connecttion.query(
            "INSERT INTO users(email,fulname,password) VALUES(?,?,?)",
            [email,name,password],
            (err,results,firlds)=>{
                if(err){
                    console.log("Error! insert a user into the database.",err)
                    return res.status(400).send();
                }
                return res.status(201).json({message:"New user successfully created."})
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
})

//Read all user
app.get("/read",(req,res)=>{
    try{
        connecttion.query(
            "SELECT * FROM users",
            (err,results,firlds)=>{
                if(err){
                    console.log("Error! insert a user into the database.",err)
                    return res.status(400).send();
                }
                return res.status(201).json({results});
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }

})

//Read single user with email
app.get("/read/:email",(req,res)=>{
    const email = req.params.email;
    try{
        connecttion.query(
            "SELECT * FROM users WHERE email = ?",[email],
            (err,results,firlds)=>{
                if(err){
                    console.log("Error! read database.",err)
                    return res.status(400).send();
                }
                if(results === null){
                    return res.status(201).json({message:"The email is not exit."});
                    
                }else{
                    return res.status(201).json({results});
                }
                
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }

})

//update 
app.patch("/update/:email",(req,res)=>{
    const email = req.params.email;
    const newPass = req.body.newPass;
    try{
        connecttion.query(
            "UPDATE users SET password = ? WHERE email = ?",[newPass,email],
            (err,results,firlds)=>{
                if(err){
                    console.log("Error! update user.",err)
                    return res.status(400).send();
                }
                if(results){
                    return res.status(201).json({message:"update successfully."});
                } 
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }


})

//delete
app.delete("/delete/:email",(req,res)=>{
    const email = req.params.email;
    try{
        connecttion.query(
            "DELETE FROM users WHERE email = ?",[email],
            (err,results,firlds)=>{
                if(err){
                    console.log("Error! delete user.",err)
                    return res.status(400).send();
                }
                if(results.affectedRows === 0){
                    return res.status(404).json({message:"No delete user."});
                }else{
                    return res.status(200).json({message:"No delete user."});
                } 
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }

})
app.listen(3000,()=>{
    console.log("==> Server is running on port 3000");
})