const user = require('../models/user.model')
const bcyrpt = require('bcrypt')
const Response = require("../utils/response");
const APIError = require('../utils/errors');
const { createToken, createTemporaryToken, decodedTemporaryToken } = require('../middlewares/auth');
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const moment = require("moment")

////LOGİN
const login = async (req, res) => {

  const { email, password } = req.body
  const userInfo = await user.findOne({ email })
  const comparePassword = await bcyrpt.compare(password, userInfo.password)

  console.log(userInfo);

  if (!userInfo) {
    throw new APIError("Şifre veya email hatalı", 401)
  }

  if (!comparePassword) {
    throw new APIError("Şifre hatalı", 401)
  }

  createToken(userInfo, res)
}
////REGİSTER
const register = async (req, res) => {
  const { email } = req.body;

  const userCheck = await user.findOne({ email });

  if (userCheck) {
    throw new APIError("Kullanımda olan email", 401)
  }

  req.body.password = await bcyrpt.hash(req.body.password, 10);

  console.log("hash şifre : ", req.body.password);

  const userSave = new user(req.body);

  await userSave
    .save()
    .then((data) => {
      return new Response(data, "Kayıt Başarıyla Eklendi").created(res);
    })
    .catch((err) => {
      console.log(err);
      return new Response(data, "Kullanıcı Kayıt Edilemedi").error400(res);
    });
};
//////ME
const me = async (req, res) => {
  console.log("me fonksiyonu içerisinde")
  return new Response(req.user).success(res)
}
////FORGER PASS
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  const userInfo = await user
    .findOne({ email })
    .select(" name lastname email ");

  if (!userInfo) return new APIError("Geçersiz Kullanıcı", 400);

  console.log("userInfo : ", userInfo);

  const resetCode = crypto.randomBytes(3).toString("hex");

  console.log(resetCode);

  await sendEmail({
    from: process.env.EMAIL_USER,
    to: userInfo.email,
    subject: "Şifre Sıfırlama",
    text: `Şifre Sıfırlama Kodunuz ${resetCode}`
  })

  await user.updateOne(
    { email },
    {
      reset: {
        code: resetCode,
        time: moment(new Date())
          .add(15, "minute")
          .format("YYYY-MM-DD HH:mm:ss"),
      },
    }
  );

  return new Response(true, "Lütfen Mail Kutunuzu Kontrol Ediniz").success(res);
};
/////RESET CODE
const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;

  const userInfo = await user.findOne({ email }).select("_id name lastName email reset")

  if (!userInfo) {
    throw new APIError("Geçersiz Kod! ", 401)
  }

  const dbTime = moment(userInfo.reset.time)
  const nowTime = moment(new Date())

  const timeDiff = dbTime.diff(nowTime, "minutes")

  console.log("zamn farkı", timeDiff)

  if (timeDiff <= 0 || userInfo.reset.code !== code) {
    throw new APIError("Geçersiz Kod", 401);
  }

  const temporaryToken = await createTemporaryToken(
    userInfo._id,
    userInfo.email
  );

  return new Response(
    { temporaryToken },
    "Şifre Sıfırlama Yapabilirsiniz"
  ).success(res);

}
///RESET PASS
const resetPassword = async (req, res) => {
  const { password, temporaryToken } = req.body;

  const decodedToken = await decodedTemporaryToken(temporaryToken);
  console.log("decodedToken : ", decodedToken);

  const hashPassword = await bcyrpt.hash(password, 10);

  await user.findByIdAndUpdate(
    { _id: decodedToken._id },
    {
      reset: {
        code: null,
        time: null,
      },
      password: hashPassword,
    }
  );

  return new Response(decodedToken, "Şifre Sıfırlama Başarılı").success(res)
};

module.exports = { login, register, me, forgetPassword, resetCodeCheck, resetPassword }