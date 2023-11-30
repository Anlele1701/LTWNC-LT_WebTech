const khachHangModel = require("../models/khachHangModel");
var khacHangService = require("../services/khachHangService");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

var dangKy = async (req, res) => {
  var regInformUser = await khacHangService.dangKy(req);
  if (regInformUser === "Email existed!") {
    res.send({ emailExisted: regInformUser });
  } else if (typeof regInformUser === "string") {
    res.send({ inValid: regInformUser });
  } else res.send(regInformUser);
};

var dangNhap = async (req, res) => {
  var logInformUser = await khacHangService.dangNhap(req);
  if (typeof logInformUser === "string") {
    res.send({ invalid: logInformUser });
  } else {
    if (logInformUser === "Invalid password!") {
      res.send({ invalid: logInformUser });
      console.log();
    } else {
      console.log({ token: logInformUser });
      res.send(logInformUser);
const sendEmail = async (req, res) => {
  try {
    const result = await khacHangService.sendEmail(req, res);
    if (result === "Email not found") {
      return res.send({ message: result });
    } else if (result === "Lỗi gửi email") {  
      return res.send({ message: result });
    }
  }
};
    return res.send({ message: "Hãy kiểm tra email" });
  } catch (e) {
    console.log("Lỗi trong controller của sendEmail");
  }
};
const resetPassword = async (req, res) => {
  try {
    const result = await khacHangService.resetPassword(req, res);
    return res.send({ message: "Reset password thành công" });
  } catch (e) {
    console.log("Lỗi trong controller của resetPassword");
  }
};

var verifyEmail = async (req, res) => {
  var verify = await khacHangService.verifyEmail(req);
};

    var verify=await khacHangService.verifyEmail(req)
}
