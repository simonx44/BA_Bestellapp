const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME } = process.env;

exports.handler = async (event) => {

  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  } else if (!event.body) {
    return Response.response(400, "missing body");
  } else {
  }
  return await updateCustomerData(event);
};

/**
 * Kundeninformationen werden geupdated
 * @param {*} event - API Gateway Event
 * @returns Http Response
 */
async function updateCustomerData(event) {

  const { id } = event.pathParameters;

  let dbParams;

  const body = JSON.parse(event.body);

  const { updateType } = body;

  // Unterscheidung zwischen UpdateType -> Name inital in Tabelle vorhanden, Adresse nicht
  if (updateType === "name") {
    const { firstname, lastname } = body;

    dbParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: `CUST#${id}`,
        SK: "INFO",
      },
      UpdateExpression: "set #a = :x, #b = :y",
      ExpressionAttributeNames: { "#a": "firstname", "#b": "lastname" },
      ExpressionAttributeValues: {
        ":x": firstname,
        ":y": lastname,
      },
    };

    const { error, data } = await DynamoDB.update(dbParams);

    if (error) {
      return Response.response(500, error);
    }

    return Response.response(200, data);
  } else if (updateType === "adress") {
    const { postleitzahl, stadt, strasse, hausnummer } = body;

    dbParams = {
      TableName: TABLE_NAME,
      Item: {
        PK: `CUST#${id}`,
        SK: `ADRESS`,
        postleitzahl: postleitzahl,
        stadt: stadt,
        strasse: strasse,
        hausnummer: hausnummer,
      },
    };

    const { error, data } = await DynamoDB.put(dbParams);

    if (error) {
      return Response.response(500, error);
    }
    return Response.response(200, data);
  } else {
    return Response.response(400, "no valid updateType");
  }
}
