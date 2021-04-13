/**
 * @file Function toolbox to interact with the database
 * @version 1.0
 * @author FarSpace832c
 */

const mysql = require("mysql");
const sha256 = require("js-sha256").sha256;

/**
 * Class used to interact with the database
 * @type {Object}
 * @return {Object} functions to use with the Query module
 * @name Query
 * @namespace Query
 */
let Query = (function () {
  /** @constant {Object} Query.connection Connection to the database, required to send queries to the mysql tables*/
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "farspace"
  });

  /**
   * @function Query.insertUser
   * @param {string}    email    The email that will be inserted into the database
   * @param {string}    username The username that will be inserted into the database
   * @param {string}    password The password that will be inserted into the database
   * @param {Function}  callback The callback that will send the response to the client
   * @returns {} /
   * @description Performs an INSERT query to add an user into the database
  */
  insertUser = (email, username, password, callback) => {
    if (email.length > 3 && /[@]/.test(email)) {
      //TODO change builds string
      connection.query(
        "INSERT INTO accounts (email, password, username, level, builds, date) VALUES (?,?,?,?,?,?)",
        [
          email,
          sha256(password),
          username,
          0,
          "TMP",
          new Date(),
        ],
        (err, result) => {
          if (err) throw err;

          callback(result !== undefined ? result.affectedRows : 0);

          return;
        }
      );
    }
  };

  //=================================================================================
  /**
   * @function Query.getUser
   * @param {string}    email     The email the user used for his account
   * @param {Function}  callback  The callback used to 
   * @returns {} /
   * @description Performs a SELECT query to get a user's infos from the database
  */
  let getUser = (email, password, callback) => {
    // Check if the user already exists
    connection.query(
      "SELECT email, username FROM accounts WHERE email=? AND password=?;",
      [email, password],
      (err, result) => {
        if (err) throw err;

        callback(result[0] !== undefined ? { username: result[0].username, email: result[0].email } : undefined);
        
        return;
      }
    );
  };

  //=================================================================================
  /**
   * @function Query.hasUser
   * @param {string}    email    The email the user used for his account
   * @param {Function}  callback The callback says if the database contains the user or not
   * @returns {} /
   * @description Performs a SELECT query to check if a user is in the database
  */
  let hasUser = (email, callback) => {
    // Check if the user already exists
    connection.query(
      "SELECT email FROM accounts WHERE email=?;",
      [email],
      (err, result) => {
        if (err) throw err;
        
        callback(result[0] !== undefined);// If the user was found => true, otherwise false
        
        return;
      }
    );
  }


  //=================================================================================
  //=================================================================================
  return {
    insertUser: (email, username, password, callback) => insertUser(email, username, password, callback),
    getUser: (email, callback, password) => getUser(email, password, callback),
    hasUser: (email, callback) => hasUser(email, callback),
  }
})();

module.exports = Query;
