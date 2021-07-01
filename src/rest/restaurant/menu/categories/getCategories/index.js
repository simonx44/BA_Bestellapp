const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  } else {
    const { id } = event.pathParameters;
    const dbParams = {
      Key: { PK: `REST#${id}`, SK: "MENU#CATEGORIES" },
      TableName: TABLE_NAME,
    };

    let { error, data } = await DynamoDB.get(dbParams);

    if (error) {
      return Response.response(500, "error");
    }
    return Response.response(200, data);
  }
};
