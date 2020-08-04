export default {
  listId: "64babb97f3",
  subjectLineEmail: "AEZAKMI Browser Team",
  previewTextEmail: "Yo Bro!",
  compaignName: `Aezakmi passenger automate(test) ${new Date(
    new Date().setHours(0, 0, 0, 0) - 172800000,
  ).toLocaleDateString()}`,
  templateId: 228616,
  dbName: "fingerprint",
  objConfMongoConnect: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  modelName: "User",
  objConfMongoModel: {
    mail: String,
    license: String,
    datereg: Date,
  },
  collectionName: "authCollection",
  querydb: {
    $and: [
      {
        datereg: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0) - 172800000),
        },
      },
      {
        datereg: {
          $lte: new Date(new Date().setHours(23, 59, 59, 999) - 172800000),
        },
      },
    ],
    license: "passenger",
  },
};
