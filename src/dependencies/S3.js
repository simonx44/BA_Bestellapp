const AWS = require("aws-sdk");

const s3Client = new AWS.S3();

const S3 = {
  /**
   * Beschafft eine Datei innerhalb eines S3-Buckets
   * @param {*} fileName - Name der Datei
   * @param {*} bucket - Bucket ARN
   * @returns
   */
  async get(fileName, bucket) {
    const params = {
      Bucket: bucket,
      Key: fileName,
    };

    let data = await s3Client.getObject(params).promise();

    if (!data) {
      throw Error(`Failed to get file ${fileName}, from ${bucket}`);
    }

    if (fileName.slice(fileName.length - 4, fileName.length) == "json") {
      data = data.Body.toString();
    }
    return data;
  },
  /**
   * Lädt eine Datei in ein angebenen Bucket
   * @param {*} data - hochzuladende Datei
   * @param {*} fileName - Name der Datei
   * @param {*} bucket - S3-Bucket ARN
   * @returns
   */
  async write(data, fileName, bucket) {
    const params = {
      Bucket: bucket,
      Body: JSON.stringify(data),
      Key: fileName,
    };

    const newData = await s3Client.putObject(params).promise();

    if (!newData) {
      throw Error("there was an error writing the file");
    }

    return newData;
  },
};

module.exports = S3;
