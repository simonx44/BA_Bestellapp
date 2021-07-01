var aws = require("aws-sdk");
var ses = new AWS.SES({apiVersion: '2010-12-01'});
const { MAIL, TABLE_NAME} = process.env;


// Funktion kann nur genutzt werden, wenn registrierte Mail für AWS SES aktiviert wird
// Angelegte Mails befinden sich inital in einem Sandbox-Modus
// Entsprechend wird diese Funktion nicht richtig ausimplementiert

const { MAIL, TABLE_NAME} = process.env;


exports.handler = async (event) => {

return;
  var params = {
    Destination: {
      ToAddresses: [MAIL],
    },
    Message: {
      Body: {
        Text: { Data: "Test" },
      },

      Subject: { Data: "Test Email" },
    },
    Source: MAIL,
  };
 
return await ses.sendEmail(params).promise()


};
