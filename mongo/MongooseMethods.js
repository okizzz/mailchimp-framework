import mongoose from "mongoose";

export default class MongooseMethods extends mongoose.Mongoose {
  constructor(
    mongoUrl,
    dbName,
    objConfMongoConnect,
    modelName,
    objConfMongoModel,
    collectionName,
    querydb
  ) {
    super().connect(`${mongoUrl}/${dbName}`, objConfMongoConnect);
    this.modelClass = this.model(modelName, objConfMongoModel, collectionName);
    this.querydb = querydb;
  }
  getData = (callback) => {
    this.modelClass.find(this.querydb, callback);
  };
}
