const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  if (!event || !event.pathParameters.id || !event.pathParameters.itemid) {
    return Response.response(400, "missing Parameters");
  } else {
    const { id, itemid } = event.pathParameters;

    const dbParams = {
      Key: {
        PK: `REST#${id}`,
        SK: `MENU#ITEM#${itemid}`,
      },
      TableName: TABLE_NAME,
    };
    //addToTable
    let { error, data } = await DynamoDB.delete(dbParams);

    if (error) {
      return Response.response(500, "error");
    }
    return Response.response(200, data);
  }
};
