let admin = require("firebase-admin");
let serviceAccount = require("../../kaidelivery-f399f-firebase-adminsdk-kgj96-7f2eb71903.json");

module.exports = pushNotification = (message, fcmToken) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://kaidelivery-f399f.firebaseio.com"
    });
  }

  let registrationToken = fcmToken;

  let payload = {
    data: {
      title: "Kaidelivery",
      message: message
    }
  };

  let options = {
    priority: "high"
  };

  admin
    .messaging()
    .sendToDevice(registrationToken, payload, options)
    .then(res => {
      console.log("Successfully send message", res);
    })
    .catch(err => {
      console.log("Failed send message", err);
    });
};
