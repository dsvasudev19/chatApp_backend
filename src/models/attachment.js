'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attachment.init({
    messageId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    file_name:DataTypes.STRING,
    type: DataTypes.STRING,
    url: {
      type:DataTypes.STRING,
      get(){
        let var1=process.env.BASE_URL;
        let var2=this.getDataValue("file_name")
        return var1 && var2 ? var1+"/"+var2:"null"
      }
    },
    size: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Attachment',
    tableName:'attachments',
    paranoid:true
  });
  return Attachment;
};