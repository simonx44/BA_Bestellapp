const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  let dbParams = {};

  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  } else if (!event.body) {
    return Response.response(400, "missing body");
  } else {
    const { id } = event.pathParameters;

    const body = JSON.parse(event.body);

    const { categories } = body;
    dbParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: `REST#${id}`,
        SK: "MENU#CATEGORIES",
      },
      UpdateExpression: "set #a = :x",
      ExpressionAttributeNames: { "#a": "categories" },
      ExpressionAttributeValues: {
        ":x": categories,
      },
    };

    const { error, data } = await DynamoDB.update(dbParams);

    if (error) {
      return Response.response(500, error);
    }

    return Response.response(200, data);
  }
};
