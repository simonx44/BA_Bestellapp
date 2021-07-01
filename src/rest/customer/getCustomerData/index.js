const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME } = process.env;

/**
 *
 * @param {*} event - API Gateway Event
 * @returns Response (Statuscode + result)
 */
exports.handler = async (event) => {
  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  } else {
    const { id } = event.pathParameters;
    return await getUserData(id);
  }
};

/**
 * Beschafft Benutzerdaten zu einer übegebenen Id
 * @param {*} id - Userid
 * @returns
 */
async function getUserData(id) {
  const dbParams = {
    ExpressionAttributeValues: {
      ":v1": `CUST#${id}`,
    },
    KeyConditionExpression: "PK = :v1",

    TableName: TABLE_NAME,
  };

  let { error, data } = await DynamoDB.query(dbParams);
  if (error) {
    return Response.response(500, "error");
  }
  return Response.response(200, data);
}