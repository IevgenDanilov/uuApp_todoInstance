const { TestHelper } = require("uu_appg01_server-test");

class DbTestHelper {
  constructor(collectionName) {
    if (!collectionName) {
      throw new Error("Missed database name in DbTestHelper constructor");
    }
    this.collectionName = collectionName;
  }

  async insert(object) {
    let result = await TestHelper.executeDbScript(`db.${this.collectionName}.insertOne(${JSON.stringify(object)});`);

    return {
      ...object,
      id: result.insertedId.toString(),
    };
  }

  async update(filter, data) {
    filter = this._filterTransform(filter);
    let result = await TestHelper.executeDbScript(
      `db.${this.collectionName}.findOneAndUpdate(${filter}, {$set: ${JSON.stringify(
        data
      )}}, { returnNewDocument: true});`
    );

    return this._clearId(result);
  }

  async delete(filter) {
    filter = this._filterTransform(filter);
    await TestHelper.executeDbScript(`db.${this.collectionName}.deleteOne(${filter});`);
  }

  async findOne(filter) {
    filter = this._filterTransform(filter);

    let result = await TestHelper.executeDbScript(`db.${this.collectionName}.findOne(${filter})`);
    return this._clearId(result);
  }

  /**
   * remove - remove objects from collections that passed to filter rules. If filter = {} or is not passed
   *  method remove all documents from collection
   *
   * @param filter {object} - filter
   * @returns {Promise<void>}
   */
  async remove(filter = {}) {
    filter = this._filterTransform(filter);
    await TestHelper.executeDbScript(`db.${this.collectionName}.remove(${filter})`);
  }

  /**
   * _filterTransform - Transform filter object into string JSON, if object has id or _id value it is transormed
   *      into ObjectId([id]) to have abillity be queried by mongo Db driver
   *
   * @param filter {object} - query filter
   * @returns {string} - stringified JSON object
   * @private
   */
  _filterTransform(filter) {
    let id;
    if (filter.hasOwnProperty("id") || filter.hasOwnProperty("_id")) {
      id = filter.id || filter._id;
      delete filter.id;

      filter._id = "$mongoId$";

      filter = JSON.stringify(filter).replace(/"\$mongoId\$"/g, `ObjectId('${id}')`);
      return filter;
    }
    return JSON.stringify(filter);
  }

  /**
   * _clearId - If obcject has _id parameer it will be transformed into id
   *
   * @param object {object}
   * @returns {object}
   * @private
   */
  _clearId(object) {
    let transformedObject = Object.assign({}, object);
    if (transformedObject.hasOwnProperty("_id")) {
      transformedObject.id = transformedObject._id;
      delete transformedObject._id;
    }

    return transformedObject;
  }
}

module.exports = DbTestHelper;
