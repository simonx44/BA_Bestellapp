const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME, INDEX_NAME, INDEX2_NAME } = process.env;
/**
 * Eingeganene Bestellungen eines Restaurant 
 * @param {*} event 
 * @returns 
 */
exports.handler = async (event) => {
  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  }

  const { id } = event.pathParameters;

  const dbParams = {
    ExpressionAttributeValues: {
      ":pk": `REST#${id}`,
      ":sk": "ORDER#",
    },
    ExpressionAttributeNames: {
      "#pk": "GSI2-PK",
      "#sk": "GSI2-SK",
    },
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk,:sk)",

    TableName: TABLE_NAME,
    IndexName: INDEX2_NAME,
  };

  let { error, data } = await DynamoDB.query(dbParams);
  if (error) {
    console.log(error);
    return Response.response(500, "error");
  } else {
    const orders = { OPEN: [], CLOSED: [], QUEUE: [], READY: [] };

    for (const order of data.Items) {
      const { date, totalPrice, id, state, info } = order;

      orders[state].push({
        date,
        totalPrice,
        id,
        state,
        info,
      });
    }
    return Response.response(200, orders);
  }
};
