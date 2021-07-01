var AWS = require("aws-sdk");

const { addUsertoGroup, addUserToTable } = require("./helper");
const { TABLE_NAME } = process.env;
exports.handler = async (event) => {
  const docClient = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
  });

  if (
    !event ||
    !event.userPoolId ||
    !event.request ||
    !event.request.userAttributes
  ) {
    return {error: "Error"}, null;
  }

  //addToTable
  await addUserToTable(event, docClient, TABLE_NAME);
  await addUsertoGroup(event, cognitoidentityserviceprovider);
  return null, event;
};
