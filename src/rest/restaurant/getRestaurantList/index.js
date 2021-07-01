const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME, INDEX_NAME } = process.env;
/**
 * Beschafft Restaurants zur Übersicht
 * @param {*} event 
 * @returns 
 */
exports.handler = async (event) => {
  const dbParams = {
    ExpressionAttributeValues: {
      ":pk": `RESTAURANT`,
      ":sk": "REST#",
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
    console.log("Fehler");
    console.log(error);
    return Response.response(500, "error");
  } else {
    const restaurantList = [];
    
    for (const item of data.Items) {
      let restaurant = {
        id: item.id,
        adress: item.adress,
        description: item.description,
        openhours: item.openhours,
        small_url: item.small_url,
        restaurantName: item.restaurantName,
      };
      restaurantList.push(restaurant);
    }

    return Response.response(200, restaurantList);
  }
};
