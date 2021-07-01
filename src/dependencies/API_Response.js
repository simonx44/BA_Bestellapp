//** Response Objekt, als Antwort auf API Zugriff, enthält alle benötigten HEADER */
const Response = {
  response(statusCode, body) {
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  },
};

module.exports = Response;
