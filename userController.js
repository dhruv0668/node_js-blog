import UserModel from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
// import transporter from "../config/emailConfig.js";
import productModel from "../models/productlist.js";

class UserController {
    static userRegistration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body
        const user = await UserModel.findOne({ email: email });
        if (user) {
            res.send({ "status": "failed", "message": "user already exists" })
        } else {
            if (name && email && password && password_confirmation && tc) {
                if (password === password_confirmation) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc
                        })
                        await doc.save()
                        const saved_user = await UserModel.findOne({ email: email })

                        //generate jwt token
                        const token = jwt.sign({ user_ID: saved_user._id },
                            process.env.JWT_SECRET_KEY, { expiresIn: '10d' })

                        res.send({ "status": "success", "message": "Registration successfully", "token": token })
                    } catch (error) {
                        console.log(error);
                        res.send({ "status": "failed", "message": "password and confirmation password" })
                    }
                } else {
                    res.send({ "status": "failed", "message": "unable to Register" })
                }

            } else {
                res.send({ "status": "failed", "message": "all feild is require" })
            }
        }
    }

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email });
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (user.email === email && isMatch) {

                        //generate jwt token
                        const token = jwt.sign({ user_ID: user._id },
                            process.env.JWT_SECRET_KEY, { expiresIn: '10d' })

                        res.send({ "status": "success", "message": "Login Success", "token": token })
                    } else {
                        res.send({ "status": "failed", "message": "Email or Password is not valid" })
                    }
                } else {
                    res.send({ "status": "failed", "message": "Your are not a registered user" })
                }
            } else {
                res.send({ "status": "failed", "message": "all feild is require" })
            }
        } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Enable to Login" })
        }
    }

    static passwordchange = async (req, res) => {
        const { password, password_confirmation } = req.body;
        if (password && password_confirmation) {
            if (password !== password_confirmation) {
                res.send({ "status": "failed", "message": "password and confirm password dosen't match" })
            } else {
                const salt = await bcrypt.genSalt(10)
                const newhashPassword = await bcrypt.hash(password, salt)
                await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newhashPassword } })
                res.send({ "status": "success", "message": "password change successfully " })
            }
        } else {
            res.send({ "status": "failed", "message": "all feild is require" })
        }
    }

    static loggedUser = async (req, res) => {
        res.send({ "user": req.user })
    }

    static sendUserPasswordResetPassword = async (req, res) => {
        const { email } = req.body
        if (email) {
            const user = await UserModel.findOne({ email: email })

            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ user_ID: user._id }, secret, { expiresIn: '10m' })
                const link = `http://localhost:127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log(link)

                // send email

                // let info = await transporter.sendMail({
                //     from :process.env.EMAIL_FROM,
                //     to :"rudanidhruv01@gmail.com",
                //     subject :"dhruvshop - password change link",
                //     html :`<a href=${link}>click here</a> to Reset Your Password`
                // })

                res.send({ "status": "success", "message": "password Reset Email sent.. Please check Your Email" })

            } else {
                res.send({ "status": "failed", "message": "Email dosen't exists" })
            }

        } else {
            res.send({ "status": "failed", "message": "Email feild is require " })
        }
    }

    static userPasswordReset = async (req, res) => {
        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token, new_secret)
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    res.send({ "status": "failed", "message": "password and confirm password dosen't match" })
                } else {
                    const salt = await bcrypt.genSalt(10)
                    const newhashPassword = await bcrypt.hash(password, salt)
                    await UserModel.findByIdAndUpdate(user._id, { $set: { password: newhashPassword } })
                    res.send({ "status": "success", "message": "password Reset successfully " })
                }
            } else {
                res.send({ "status": "failed", "message": "all feild is require" })
            }
        } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Invalid Token" })
        }
    }
    static productAdd = async (req, res) => {
        const { productName, price, category, company } = req.body
        if (productName && price && category && company) {
            const doc = new productModel({
                productName: productName,
                price: price,
                category: category,
                company: company
            })
            res.send({ "status": "success", "message": "product add successfully" })
            await doc.save()
        } else {
            res.send({ "status": "failed", "message": "all feild are require" })
        }
    }
    // static getproduct = async (req,res) => {
    //     let product = await product.find();
    //     if(product.length < 0){
    //         res.send(product)
    //         res.render()
    //     }else{
    //         res.send("product not found")
    //     }
    // }

    // storage image

    

  
}




export default UserController;