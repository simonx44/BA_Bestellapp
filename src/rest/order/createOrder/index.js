const Response = require("/opt/API_Response");
const DynamoDB = require("/opt/DynamoDB");
const SNS = require("/opt/SNS");
const { v4: uuidv4 } = require("uuid");

const { TABLE_NAME, INDEX_NAME, INDEX_NAME2, TOPIC } = process.env;

exports.handler = async (event, context) => {
  if (!event) {
    return Response.response(400, "missing Parameters");
  } else if (!event.body) {
    return Response.response(400, "missing body");
  } else {
    const body = JSON.parse(event.body);

    const { restaurantId, customerId, items } = body;

    if (!restaurantId || !customerId || !items) {
      return Response.response(400, "missing Parameter in body");
    } else if (items.length == 0) {
      return Response.response(400, "No items");
    }

    const { error, result } = await createOrder(
      restaurantId,
      customerId,
      items
    );

    if (error) {
      return Response.response(400, error);
    }
    return Response.response(200, result);
  }
};

/**
 * Erstellt eine Nachricht zu einem SNS-Topic
 * @param {*} customerId - KundenId
 * @param {*} restaurantId - RestaurantId
 * @param {*} orderId - Bestellid
 * @param {*} info - Informationen zu Kunde und Restaurant
 */
async function createSNSMessage(customerId, restaurantId, orderId, info) {
  const subject = `Bestellung: ${orderId}`;
  const message = "Bestellung";
  const attributes = {
    customer: { DataType: "String", StringValue: `${customerId}` },
    customerMail: { DataType: "String", StringValue: `${info.customer.email}` },
    customerName: { DataType: "String", StringValue: `${info.customer.name}}` },
    restaurant: { DataType: "String", StringValue: `${restaurantId}` },
    restaurantMail: {
      DataType: "String",
      StringValue: `${info.restaurant.email}`,
    },
    restaurantName: {
      DataType: "String",
      StringValue: `${info.restaurant.name}`,
    },
    orderId: { DataType: "String", StringValue: `${orderId}` },
  };

  await SNS.publishMessage(message, subject, attributes, TOPIC);
}

/**
 * Bestellung anlegen
 * @param {*} restaurantId
 * @param {*} customerId
 * @param {*} items
 * @returns Erfolg oder Fehler
 */
async function createOrder(restaurantId, customerId, items) {
  const productIds = [];
  const productMap = {};
  const orderId = uuidv4();

  // Für die Beschaffung der bestellten Artikel aus der Datenbank
  for (const item of items) {
    productIds.push({
      PK: `REST#${restaurantId}`,
      SK: `MENU#ITEM#${item.id}`,
    });

    productMap[item.id] = item;
  }

  // Info über Parteien beschaffen
  var { error: errorInfo, data: info } = await getUserAndRestaurantName(
    customerId,
    restaurantId
  );

  if (errorInfo) {
    return { error: errorInfo, data: null };
  }

  //  Beschafft Info über Produkte zur Bestellung
  var { error, data: products } = await getProductFromDB(
    productIds,
    restaurantId
  );

  if (error) {
    return { error, data: null };
  }

  // Generiert Datenbankparameter über Positionen und berechent Preis
  var { error: errorPos, data: orderPositions } = generateOrderPosition(
    products,
    productMap,
    orderId
  );

  if (errorPos) {
    return { error: errorPos, data: null };
  }
  // Bestellung in Datenbank anlegen
  var { error: errorWrite, data: writeData } = await writeOrderInDB(
    orderPositions.positions,
    orderPositions.price,
    customerId,
    restaurantId,
    orderId,
    info
  );
  if (errorWrite) {
    return { error: errorWrite, data: null };
  }

  await createSNSMessage(customerId, restaurantId, orderId, info);

  return { error: null, data: writeData };
}
/**
 * Berechnet der Preis auf Grundlage der aufgelistetetn Produkte und erstellt Positionen für der Bestellung
 * @param {*} productsDB
 * @param {*} productsOrder
 * @param {*} orderId
 * @returns
 */
function generateOrderPosition(productsDB, productsOrder, orderId) {
  if (Object.keys(productsOrder).length != productsDB.length) {
    return { error: "Bestellte Artikel nicht vorhanden", data: null };
  } else {
    let price = 0;
    const positionParams = [];

    for (const item of productsDB) {
      const id = item.id;
      const positonInOrder = productsOrder[id];

      var positionPrice = parseFloat(item.price) * positonInOrder.amount;

      price += positionPrice;

      positionParams.push({
        PutRequest: {
          Item: {
            PK: `ORDER#${orderId}`,
            SK: `ITEM#${item.id}`,
            entityType: "ORDERITEM",
            title: item.title,
            amount: positonInOrder.amount,
            note: positonInOrder.note,
            price: positionPrice,
          },
        },
      });
    }
    return { error: null, data: { price: price, positions: positionParams } };
  }
}
/**
 * Beschafft Kundeninfo und Restaurantinfo
 * @param {*} customerId
 * @param {*} restaurantId
 * @returns
 */
async function getUserAndRestaurantName(customerId, restaurantId) {
  try {
    const keys = [
      {
        PK: `REST#${restaurantId}`,
        SK: `INFO`,
      },
      {
        PK: `CUST#${customerId}`,
        SK: `INFO`,
      },
    ];

    var params = {
      RequestItems: {
        [TABLE_NAME]: {
          Keys: keys,
        },
      },
    };

    var { error, data } = await DynamoDB.getBatchItems(params);

    if (error) {
      return { error, data: null };
    } else {
      const response = data["Responses"][TABLE_NAME];
      const customerData =
        response[0].entityType === "CUSTOMER" ? response[0] : response[1];
      const restaurantData =
        response[0].entityType === "RESTAURANT" ? response[0] : response[1];

      const info = {
        customer: {
          email: customerData.email ? customerData.email : "Keine Daten",
          name:
            customerData.firstname && customerData.lastname
              ? customerData.firstname + " " + customerData.lastname
              : "Keine Daten",
        },
        restaurant: {
          email: restaurantData.email ? restaurantData.email : "Keine Daten",
          name: restaurantData.restaurantName
            ? restaurantData.restaurantName
            : "Keine Daten",
        },
      };

      return { error: null, data: info };
    }
  } catch (error) {
    return { error, data: null };
  }
}
/**
 * Bestellung wird in die Datenbank aufgenommen
 * @param {*} orderPositions - Positionen
 * @param {*} price - Gesamtpreis
 * @param {*} customerId - KundenID
 * @param {*} restaurantId - RestaurantID
 * @param {*} orderId - BestellID
 * @param {*} info - Informationen über Kunde und Restaurant
 * @returns
 */
async function writeOrderInDB(
  orderPositions,
  price,
  customerId,
  restaurantId,
  orderId,
  info
) {
  if (!orderPositions || !price || !customerId || !restaurantId || !orderId) {
    return { error: "missing data", data: "" };
  }

  // Aktuelles Datum erzeugen
  var currentDate = new Date();
  var dd = String(currentDate.getDate()).padStart(2, "0");
  var mm = String(currentDate.getMonth() + 1).padStart(2, "0");
  var yyyy = currentDate.getFullYear();

  currentDate = dd + "/" + mm + "/" + yyyy;

  //Header
  var headerParams = {
    PutRequest: {
      Item: {
        PK: `ORDER#${orderId}`,
        SK: `HEAD`,
        id: orderId,
        entityType: "ORDER",
        "GSI1-PK": `CUST#${customerId}`, // Um nach Kundenaufträgen zu suchen, über INDEX
        "GSI1-SK": `ORDER#${orderId}`,
        "GSI2-PK": `REST#${restaurantId}`, // Um nach Kundenaufträgen zu suchen
        "GSI2-SK": `ORDER#${orderId}`,
        state: "OPEN",
        totalPrice: price,
        info: info,
        date: `${currentDate}`,
      },
    },
  };

  var params = {
    RequestItems: {
      [TABLE_NAME]: [headerParams, ...orderPositions],
    },
  };

  var { error, data } = await DynamoDB.writeBatchItems(params);
  if (error) {
    return { error: error, data: null };
  }
  return { error: null, data: data };
}
/**
 * Bestellte Artikel aus Datenbank zum Abgleich beschaffen
 * @param {*} keys - Generierte Keys zum Zugriff auf die Datenbank
 * @returns
 */
async function getProductFromDB(keys) {
  try {
    var params = {
      RequestItems: {
        [TABLE_NAME]: {
          Keys: keys,
        },
      },
    };

    var { error, data } = await DynamoDB.getBatchItems(params);

    if (error) {
      return { error, data: null };
    } else {
      return { error: null, data: data["Responses"][TABLE_NAME] };
    }
  } catch (error) {
    return { error, data: null };
  }
}
