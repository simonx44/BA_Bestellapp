const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  }

  const { id } = event.pathParameters;

  const dbParams = {
    ExpressionAttributeValues: {
      ":pk": `ORDER#${id}`,
      ":sk": "ITEM#",
    },
    ExpressionAttributeNames: {
      "#pk": "PK",
      "#sk": "SK",
    },
    KeyConditionExpression: "#pk = :pk AND begins_with(#sk,:sk)",
    TableName: TABLE_NAME,
  };

  let { error, data } = await DynamoDB.query(dbParams);
  if (error) {
    console.log(error);
    return Response.response(500, "error");
  } else {
   
  const orderDetails = [];

   for(const orderPos of data.Items){
   
   orderDetails.push({
   id: orderPos.id,
   title: orderPos.title,
   note: orderPos.note,
   price: orderPos.price,
   amount: orderPos.amount,
   });

   }

    return Response.response(200, orderDetails);
  }
};
