const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { v4: uuidv4 } = require("uuid");
const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  } else if (!event.body) {
    return Response.response(400, "missing body");
  } else {
    const { id } = event.pathParameters;

    const body = JSON.parse(event.body);

    const { title, description, category, price } = body;
    if (!title || !description || !category || !price) {
      return Response.response(400, "missing Parameter in body");
    }

    const itemId = uuidv4();

    dbParams = {
      TableName: TABLE_NAME,
      Item: {
        PK: `REST#${id}`,
        SK: `MENU#ITEM#${itemId}`,
        id: itemId,
        title: title,
        description: description,
        category: category,
        price: price,
      },
    };

    let { error, data } = await DynamoDB.put(dbParams);

    if (error) {
      return Response.response(500, "error");
    }
    return Response.response(200, {id:itemId});
  }
};
