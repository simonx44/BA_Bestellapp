/**
 * Registrierter Nutzer wird zusätzlich in die Datenbank aufgenommen
 * @param {*} event 
 * @param {*} db 
 * @param {*} tableName 
 * @returns 
 */
function addUserToTable(event, db, tableName) {
  return new Promise(async (res, rej) => {
    try {
      const { sub, email } = event.request.userAttributes;
      var item = {};
      if (event.request.userAttributes["custom:isCustomer"] === "true") {
        item = {
          PK: { S: `CUST#${sub}` },
          SK: { S: `INFO` },
          id: { S: sub },
          entityType: { S: "CUSTOMER" },
          firstname: { S: "" },
          lastname: { S: "" },
          email: { S: email },
        };
      } else {
        item = {
          PK: { S: `REST#${sub}` },
          SK: { S: `INFO` },
          id: { S: sub },
          "GSI1-PK": { S: "RESTAURANT" },
          "GSI1-SK": { S: `REST#${sub}` },
          entityType: { S: "RESTAURANT" },
          openhours: { M: {} },
          description: { S: "" },
          restaurantName: { S: "" },
          email: { S: email },
          adress: { M: {} },
          pic_url: { S: "" },
          small_url: { S: "" },
        };
      }
      const dbParams = {
        TableName: tableName || "",
        Item: item,
      };

      await db.putItem(dbParams).promise();
      res({ error: null, success: "success" });
    } catch (error) {
      rej({ error: error, success: null });
    }
  });
}


/**
 * Benutzer wird einer Gruppe zu gewiesen
 * @param {*} event - Cognito Event
 * @param {*} cognito - Cognito Instanz
 * @returns 
 */
function addUsertoGroup(event, cognito) {
  return new Promise(async (res, rej) => {
    try {
      var groupName =
        event.request.userAttributes["custom:isCustomer"] === "true"
          ? "Customers"
          : "Restaurants";

      var params = {
        GroupName: groupName,
        UserPoolId: event.userPoolId,
        Username: event.request.userAttributes.sub,
      };

      await cognito.adminAddUserToGroup(params).promise();
      res({ error: null, success: "success" });
    } catch (error) {
      rej({ error: error, success: null });
    }
  });
}

module.exports = { addUsertoGroup, addUserToTable };
