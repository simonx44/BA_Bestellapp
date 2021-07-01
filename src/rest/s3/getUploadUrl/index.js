"use strict";

const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

// Gültigkeitsdauer des übergebenen Links
const URL_EXPIRATION_SECONDS = 300;

exports.handler = async (event) => {
  if (!event || !event.queryStringParameters) {
    return response(400, "no event found");
  }

  var result = await getUploadURL(event.queryStringParameters);

  return response(200, result);
};

/**
 * Erzeugt eine URL zum direkten Upload in ein Bucket
 * @param {*} parameters 
 * @returns 
 */
const getUploadURL = async function (parameters) {
  const { type, userid } = parameters;


  const fileName = type === "info" ? `INFO_${userid}` : "noch konfigueriene";

  const Key = `${fileName}.jpg`;

  // signed URL für S3
  const s3Params = {
    Bucket: process.env.UploadBucket,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: "image/jpeg",
    ACL: 'public-read'
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);

  return {
    uploadURL: uploadURL,
    Key,
  };
};

const response = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
