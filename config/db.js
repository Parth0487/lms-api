// Import the mysql module
const mysql = require('mysql');

// Create a MySQL connection object with the necessary configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'lms', // Specify the database name if needed
});

// Connect to the MySQL server
connection.connect(err => {
  if (err) {
    return console.error('error connecting: ' + err.stack);
  }
  console.log('connected as id ' + connection.threadId);
});

// Function to get records based on a table and where conditions
function getRecords(tableName, whereConditions) {
  let query = `SELECT * FROM ${mysql.escapeId(tableName)}`;
  if (whereConditions && Object.keys(whereConditions).length > 0) {
    const conditionStrings = Object.keys(whereConditions).map(field => {
      return `${mysql.escapeId(field)} = ${mysql.escape(whereConditions[field])}`;
    });
    query += ' WHERE ' + conditionStrings.join(' AND ');
  }

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function addRecord(tableName, recordObject) {
  const columns = Object.keys(recordObject).map(col => mysql.escapeId(col));
  const values = Object.values(recordObject).map(val => mysql.escape(val));

  const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')})`;

  console.log('query: ', query);

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function customQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

function updateRecord(tableName, dataObject, whereConditions) {
  // Map each data key to the corresponding SQL set clause, escaping identifiers and values
  const updates = Object.keys(dataObject)
    .map(key => {
      return `${mysql.escapeId(key)} = ${mysql.escape(dataObject[key])}`;
    })
    .join(', ');

  // Create the base update query
  let query = `UPDATE ${mysql.escapeId(tableName)} SET ${updates}`;

  // Construct the WHERE clause if conditions are provided
  if (whereConditions && Object.keys(whereConditions).length > 0) {
    const conditionStrings = Object.keys(whereConditions).map(field => {
      return `${mysql.escapeId(field)} = ${mysql.escape(whereConditions[field])}`;
    });
    query += ' WHERE ' + conditionStrings.join(' AND ');
  }

  console.log('Update query:', query);

  // Execute the query within a promise
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Export the connection and utility functions
module.exports = {
  connection,
  getRecords,
  addRecord,
  updateRecord,
  customQuery,
};
