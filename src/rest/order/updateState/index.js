const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const { TABLE_NAME } = process.env;

exports.handler = async (event) => {
  if (!event || !event.pathParameters.id) {
    return Response.response(400, "missing Parameters");
  }

  const { id } = event.pathParameters;

  const dbParams = {
    Key: { PK: `ORDER#${id}`, SK: "HEAD" },
    TableName: TABLE_NAME,
  };
  //addToTable
  let { error, data } = await DynamoDB.get(dbParams);

  if (error) {
    console.log(error);
    return Response.response(500, error);
  } else {
    let newState = "OPEN";

    switch (data.Item.state) {
      case "OPEN":
        newState = "QUEUE";
        break;
      case "QUEUE":
        newState = "READY";
        break;
      case "READY":
        newState = "CLOSED";
        break;
      case "CLOSED":
        return Response.response(
          500,
          "Geschlossene Aufträge können nicht verändert werden"
        );
      default:
        break;
    }

    const updateParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: `ORDER#${id}`,
        SK: "HEAD",
      },
      UpdateExpression: "set #a = :x",
      ExpressionAttributeNames: { "#a": "state" },
      ExpressionAttributeValues: {
        ":x": newState,
      },
    };

    const { error: updateError, data: updateData } = await DynamoDB.update(
      updateParams
    );

    if (updateError) {
      return Response.response(500, updateError);
    } else {
      return Response.response(200, updateData);
    }
  }
};
