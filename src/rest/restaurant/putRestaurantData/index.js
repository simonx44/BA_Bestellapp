const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME } = process.env;

/**
 * Restaurantdaten updaten
 * @param {*} event 
 * @returns 
 */
exports.handler = async (event) => {
  let dbParams = {};

  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  } else if (!event.body) {
    return Response.response(400, "missing body");
  } else {
    const { id } = event.pathParameters;

    const body = JSON.parse(event.body);

    const { updateType } = body;

    if (updateType === "info") {
      const { restaurantName, description } = body;

      dbParams = {
        TableName: TABLE_NAME,
        Key: {
          PK: `REST#${id}`,
          SK: "INFO",
        },
        UpdateExpression: "set #a = :x, #b = :y",
        ExpressionAttributeNames: {
          "#a": "restaurantName",
          "#b": "description",
        },
        ExpressionAttributeValues: {
          ":x": restaurantName,
          ":y": description,
        },
      };
    } else if (updateType === "adress") {
      const { adress } = body;
      dbParams = {
        TableName: TABLE_NAME,
        Key: {
          PK: `REST#${id}`,
          SK: "INFO",
        },
        UpdateExpression: "set #a = :x",
        ExpressionAttributeNames: { "#a": "adress" },
        ExpressionAttributeValues: {
          ":x": adress,
        },
      };
    } else if (updateType === "openinghours") {
      const { openinghours } = body;
      dbParams = {
        TableName: TABLE_NAME,
        Key: {
          PK: `REST#${id}`,
          SK: "INFO",
        },
        UpdateExpression: "set #a = :x",
        ExpressionAttributeNames: { "#a": "openhours" },
        ExpressionAttributeValues: {
          ":x": openinghours,
        },
      };
    } else {
      return Response.response(400, "no valid updateType");
    }

    const { error, data } = await DynamoDB.update(dbParams);

    if (error) {
      return Response.response(500, error);
    }

    return Response.response(200, data);
  }
};
