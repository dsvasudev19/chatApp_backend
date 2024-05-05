'use strict';
const {
  Model
} = require('sequelize');
const crypto=require("crypto")
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RefreshToken.init({
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    expiry_date: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'RefreshToken',
  });

  RefreshToken.createToken=async(user)=>{
    let _token=crypto.randomBytes(16).toString("hex").toUpperCase();
    let expiryDate=new Date()+1000*60*60*2;
    const refreshToken=await RefreshToken({
      userId:user.id,
      token:_token,
      expiry_date:expiryDate
    })
    return refreshToken.token;
    
  }
  RefreshToken.createForgotPasswordToken=async(user)=>{
    let _token=crypto.randomBytes(8).toString("hex").toUpperCase();
    let expiryDate=new Date()+1000*60*15;
    const refreshToken=await RefreshToken({
      userId:user.id,
      token:_token,
      expiry_date:expiryDate
    })
    return refreshToken.token;
    
  }

  RefreshToken.verifyExpiration=(token)=>{
    return token.expiryDate<Date.now();
  }
  return RefreshToken;
};