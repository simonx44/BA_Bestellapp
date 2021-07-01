var AWS = require("aws-sdk");
const DDB = new AWS.DynamoDB.DocumentClient();
const sharp = require("sharp");
const { TABLE_NAME, REGION, TRANSFORMEDBUCKET } = process.env;
const S3 = new AWS.S3({
  signatureVersion: "v4",
});

exports.handler = async (event) => {
  if (!event || !event.Records[0]) {
    return response(500, "fehler");
  }
  console.log("")

  const { s3 } = event.Records[0];

  const { bucket, object } = s3;

  let { error, result } = await transformImage(bucket.name, object.key);

  if (error) {
    return response(400, {});
  }

  const url = `https://${bucket.name}.s3.${REGION}.amazonaws.com/${object.key}`;

  const url_small = `https://${TRANSFORMEDBUCKET}.s3.${REGION}.amazonaws.com/${object.key}`;

  const parts = object.key.split(/[_.]/);

  const id = parts[1];

  dbParams = {
    TableName: TABLE_NAME,
    Key: {
      PK: `REST#${id}`,
      SK: "INFO",
    },
    UpdateExpression: "set #a = :x, #b = :y",
    ExpressionAttributeNames: {
      "#a": "pic_url",
      "#b": "small_url",
    },
    ExpressionAttributeValues: {
      ":x": url,
      ":y": url_small,
    },
  };

  let { error: updateError, data } = await updateRestaurant(dbParams, DDB);

  if (updateError) {
    return response(500, error);
  }
  return response(200, {});
};

const response = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

/**
 * Bild-URLs werden in der Datenbank gespeichet, um im Anschluss diese ins Frontend einzubinden
 * @param {*} dbParams 
 * @param {*} db 
 * @returns 
 */
function updateRestaurant(dbParams, db) {
  return new Promise(async (res, rej) => {
    try {
      const result = await db.update(dbParams).promise();

      res({ error: null, data: result });
    } catch (error) {
      rej({ error: error, data: null });
    }
  });
}

// Transformiert das hochgeladene Bild und lädt lädt dieses in einen zweiten Bucket
async function transformImage(bucket, key) {
  try {
    // Beschafft hochgeladenes Bild
    const img = await S3.getObject({
      Bucket: bucket,
      Key: key,
    }).promise();

    //Wandelt Bild in die gwünschte Größe um
    const buffer = await sharp(img.Body).resize(400).toFormat("png").toBuffer();
    // lädt umgewandeltes Bild in den Bucket
    await S3.putObject({
      Body: buffer,
      Bucket: TRANSFORMEDBUCKET,
      ContentType: "image/png",
      Key: key, // wird unter dem selben Name in einem 2. Bucket gespeichert
      ACL: "public-read", // direkter Zugriff über öffentliche URL
    }).promise();
    return { error: null, result: key };
  } catch (error) {
    return { error: error, result: null };
  }
}
