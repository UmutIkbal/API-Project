const router = require('express').Router()
const { login, register, me, forgetPassword, resetCodeCheck, resetPassword } = require('../controller/auth.controller')
const AuthValidation = require("../middlewares/validations/auth.validation")
const { tokenCheck } = require("../middlewares/auth")

router.post('/login', AuthValidation.login, login)

router.post('/register', AuthValidation.register, register)

router.get("/me", tokenCheck, me)

router.post("/forget-password", forgetPassword)

router.post("/reset-code-check", resetCodeCheck)

router.post("/reset-password", resetPassword)

module.exports = router