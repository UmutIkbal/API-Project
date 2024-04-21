const joi = require('joi')
const APIError = require('../../utils/errors');
const { register } = require('../../controller/auth.controller');

class AuthValidation {
    constructor() { }
    static register = async (req, res, next) => {

        try {
            await joi.object({
                name: joi.string()
                    .trim()
                    .min(3)
                    .max(100)
                    .required()
                    .messages({
                        'string.base': `İsim alanı metin olmalı`,
                        'string.empty': `İsim alanı boş olamaz`,
                        'string.min': "İsim alanı en az 3 karakterli olmalı",
                        'string.max': "isim alanı en fazla 100 karakterli olmalı",
                        'string.required': "isim alanı zorunlı"
                    }),
                    lastName: joi.string()
                    .trim()
                    .min(3)
                    .max(100)
                    .required()
                    .messages({
                        'string.base': `İsim alanı metin olmalı`,
                        'string.empty': `İsim alanı boş olamaz`,
                        'string.min': "İsim alanı en az 3 karakterli olmalı",
                        'string.max': "isim alanı en fazla 100 karakterli olmalı",
                        'string.required': "isim alanı zorunlı"
                    }),
                    email: joi.string()
                    .trim()
                    .min(3)
                    .max(100)
                    .email()
                    .required()
                    .messages({
                        'string.base': `Email alanı metin olmalı`,
                        'string.empty': `Email alanı boş olamaz`,
                        'string.min': "Email alanı en az 3 karakterli olmalı",
                        'string.max': "Email alanı en fazla 100 karakterli olmalı",
                        'string.email': "Geçerli email giriniz",
                        'string.required': "Email alanı zorunlı",
                        
                    }),
                    password: joi.string()
                    .trim()
                    .min(6)
                    .max(36)
                    .required()
                    .messages({
                        'string.base': `Şifre alanı metin olmalı`,
                        'string.empty': `Şifre alanı boş olamaz`,
                        'string.min': "şifre alanı en az 6 karakterli olmalı",
                        'string.max': "Şifre alanı en fazla 36 karakterli olmalı",
                        'string.required': "isim alanı zorunlı"
                    })
            }).validateAsync(req.body)
        } catch (error) {
            if (error.details && error?.details[0].message) 
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Lütfen Validasyon Kullarına Uyun", 400)
        }
        next()
    }
    static login = async (req, res, next) => {
        try {
            await joi.object({
                email: joi.string()
                    .trim()
                    .min(3)
                    .max(100)
                    .email()
                    .required()
                    .messages({
                        'string.base': `Email alanı metin olmalı`,
                        'string.empty': `Email alanı boş olamaz`,
                        'string.min': "Email alanı en az 3 karakterli olmalı",
                        'string.max': "Email alanı en fazla 100 karakterli olmalı",
                        'string.email': "Geçerli email giriniz",
                        'string.required': "Email alanı zorunlı",
                        
                    }),
                    password: joi.string()
                    .trim()
                    .min(6)
                    .max(36)
                    .required()
                    .messages({
                        'string.base': `Şifre alanı metin olmalı`,
                        'string.empty': `Şifre alanı boş olamaz`,
                        'string.min': "şifre alanı en az 6 karakterli olmalı",
                        'string.max': "Şifre alanı en fazla 36 karakterli olmalı",
                        'string.required': "isim alanı zorunlı"
                    })
            }).validateAsync(req.body)

        } catch (error) {
            if (error.details && error?.details[0].message) 
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Lütfen Validasyon Kullarına Uyun", 400)
        }
        next()
    } 
    
}

module.exports = AuthValidation