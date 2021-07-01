const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const DynamoDB = {
  /**
   * Beschafft einen Eintrag innerhalb einer Tabelle - Zugriff über PK
   * @param {*} params - DynamoDB- spezifische Parameter für den Zugriff auf eine Tabelle
   * @returns Fehler oder erfolgreicher Zugriff
   */
  async get(params) {
    try {
      var result = await documentClient.get(params).promise();
      return { error: null, data: result };
    } catch (error) {
      return { error: error, data: null };
    }
  },

  /**
   *  Beschafft alle Einträge einer Tabelle zu den übergebenen Parametern
   * @param {*} params - DynamoDB- spezifische Parameter für den Zugriff auf eine Tabelle
   * @returns Fehler oder erfolgreicher Zugriff
   */
  async query(params) {
    try {
      var result = await documentClient.query(params).promise();
      return { error: null, data: result };
    } catch (error) {
      return { error: error, data: null };
    }
  },
  /**
   * Ein bestehendes Item wird geändert oder neu angelegt, sollte dieses nicht vorhanden sein
   * @param {*} params - DynamoDB- spezifische Parameter für den Zugriff auf eine Tabelle
   * @returns  Fehler oder erfolgreicher Zugriff
   */
  async update(params) {
    try {
      var result = await documentClient.update(params).promise();
      return { error: null, data: result };
    } catch (error) {
      return { error: error, data: null };
    }
  },
  /**
   * Erstellt ein neues Item oder ersetzt ein bestehenden Eintrag durch einen neuen Eintrag
   * @param {*} params
   * @returns
   */
  async put(params) {
    try {
      var result = await documentClient.put(params).promise();
      return { error: null, data: result };
    } catch (error) {
      return { error: error, data: null };
    }
  },
  /**
   * Löscht ein einzelnes Item
   * @param {*} params
   * @returns
   */
  async delete(params) {
    try {
      var result = await documentClient.delete(params).promise();
      return { error: null, data: result };
    } catch (error) {
      return { error: error, data: null };
    }
  },
  /**
   * Mehrere Items werden in einem Batch-Durchlauf beschafft
   * @param {*} params
   * @returns
   */
  async getBatchItems(params) {
    try {
      var result = await documentClient.batchGet(params).promise();
      return { error: null, data: result };
    } catch (error) {
      return { error: error, data: null };
    }
  },
  /**
   * Mehrere Items werden in die Tabelle geschrieben
   * @param {*} params
   * @returns
   */
  async writeBatchItems(params) {
    try {
      var result = await documentClient.batchWrite(params).promise();
      return { error: null, data: result };
    } catch (error) {
      return { error: error, data: null };
    }
  },
};
module.exports = DynamoDB;
