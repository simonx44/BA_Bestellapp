const AWS = require("aws-sdk");
var sns = new AWS.SNS();

const SNS = {
  /**
   * Veröffentlicht eine Nachricht zu einem vorhanden Topic
   * @param {*} message 
   * @param {*} subject 
   * @param {*} attributes 
   * @param {*} topic 
   * @returns 
   */
  publishMessage: async function (message, subject, attributes, topic) {
    var params = {
      Message: message,
      Subject: subject,
      TopicArn: topic,
      MessageAttributes: attributes,
    };

    try {
      await sns.publish(params).promise();
      return { error: null, data: "Message published" };
    } catch (err) {
      console.log(err)
      return { error: err, data: null };
    }
  },
};
module.exports = SNS;
