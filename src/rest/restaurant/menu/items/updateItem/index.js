const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  if (!event || !event.pathParameters.id || !event.pathParameters.itemid) {
    return Response.response(400, "missing Parameters");
  } else if (!event.body) {
    return Response.response(400, "missing body");
  } else {
    const { id, itemid } = event.pathParameters;

    const body = JSON.parse(event.body);

    const { title, description, category, price } = body;
    if (!title || !description || !category || !price) {
      return Response.response(400, "missing Parameter in body");
    }

    const dbParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: `REST#${id}`,
        SK: `MENU#ITEM#${itemid}`,
      },
      UpdateExpression: "set #a = :x, #b = :y, #c = :z, #d = :w",
      ExpressionAttributeNames: {
        "#a": "title",
        "#b": "description",
        "#c": "category",
        "#d": "price",
      },
      ExpressionAttributeValues: {
        ":x": title,
        ":y": description,
        ":z": category,
        ":w": price,
      },
    };

    const { error, data } = await DynamoDB.update(dbParams);

    if (error) {
      return Response.response(500, "error");
    }
    return Response.response(200, data);
  }
};
