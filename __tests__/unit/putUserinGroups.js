const AWS = require("aws-sdk");
const {
  handler: lambda,
} = require("../../src/authorizer/PutUserInGroup/index");

const {
  addUsertoGroup,
  addUserToTable,
} = require("../../src/authorizer/PutUserInGroup/helper");

const AWSMock = require("aws-sdk-mock");
// This includes all tests for getByIdHandler()
describe("Test addUsertoGroup", () => {
  it("Test addUsertoGroup", async () => {
    AWSMock.mock("DynamoDB", "putItem", function (params, callback) {
      callback(null, "successfully put item in database");
    });

    let input = { TableName: "", Item: { PK: { S: `REST#$` } } };
    const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

    const result = await addUserToTable(event, dynamodb, "fakeTabelle");

    expect(result).toStrictEqual({ error: null, success: "success" });

    AWSMock.restore("DynamoDB");
  });

  it("Test addUserToGroup", async () => {
    AWSMock.mock(
      "CognitoIdentityServiceProvider",
      "adminAddUserToGroup",
      function (params, callback) {
        callback(null, "successfully put item in database");
      }
    );

    var cognito = new AWS.CognitoIdentityServiceProvider({
      apiVersion: "2016-04-18",
    });

    const result = await addUsertoGroup(event, cognito);

    expect(result).toStrictEqual({ error: null, success: "success" });

    AWSMock.restore("CognitoIdentityServiceProvider");
  });

  it("Test Missing events", async () => {
  
    const result = await lambda();

   

    expect(result).toStrictEqual({error: "missingEvent"});


  });
  it("Test lambda", async () => {
    AWSMock.mock(
      "CognitoIdentityServiceProvider",
      "adminAddUserToGroup",
      function (params, callback) {
        callback(null, "successfully put item in database");
      }
    );
    AWSMock.mock("DynamoDB", "putItem", function (params, callback) {
      callback(null, "successfully put item in database");
    });

    const result = await lambda(event);

    expect(result).toStrictEqual({ error: null });

    AWSMock.restore("CognitoIdentityServiceProvider");
    AWSMock.restore("DynamoDB");
  });
});

const event = {
  version: "1",
  region: "eu-central-1",
  userPoolId: "eu-central-1_M404wAkEX",
  userName: "669f29f1-0336-417e-a0bb-82e7f1cdae9e",
  request: {
    userAttributes: {
      sub: "669f29f1-0336-417e-a0bb-82e7f1cdae9e",
      email_verified: "true",
      "cognito:email_alias": "s111",
      "custom:isCustomer": "true",
      email: "11e",
    },
  },
  response: {},
};
