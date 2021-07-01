const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME, INDEX_NAME } = process.env;

exports.handler = async (event) => {
  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  }

  const { id } = event.pathParameters;

  return await getOrdersByCustomerId(id);
};
/**
 * 
 * @param {*} id - Customer Id
 * @returns Alle Bestellungen eines Kunden als Http-Response
 */
async function getOrdersByCustomerId(id) {
  const dbParams = {
    ExpressionAttributeValues: {
      ":pk": `CUST#${id}`,
      ":sk": "ORDER#",
    },
    ExpressionAttributeNames: {
      "#pk": "GSI1-PK",
      "#sk": "GSI1-SK",
    },
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk,:sk)",

    TableName: TABLE_NAME,
    IndexName: INDEX_NAME,
  };

  let { error, data } = await DynamoDB.query(dbParams);
  if (error) {
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
}
