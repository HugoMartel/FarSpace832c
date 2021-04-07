const mysql = require('mysql');
const sha256 = require('js-sha256').sha256;

export class QueryService {
  constructor() {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'farspace',
    });

    // Here I think we have to use any type for the request and response since req.body.fields will not be detected and won't compile otherwise
    this.insertUser = (req, res) => {
      if (
        req.body.email !== undefined &&
        req.body.username !== undefined &&
        req.body.password !== undefined
      ) {
        if (req.body.email.length > 3 && /[@]/.test(req.body.email)) {
          //TODO change builds string
          connection.query(
            'INSERT INTO accounts (email, password, username, level, builds, date) VALUES (?,?,?,?,?,?)',
            [
              req.body.email,
              sha256(req.body.password),
              req.body.username,
              0,
              '0,0,0',
              new Date(),
            ],
            (error) => {
              if (error) {
                console.error(error);
                res.status(500).json({ status: 'error' });
              } else {
                res.status(200).json({ status: 'ok' });
              }
            }
          );
        }
      }
    };
  }
}
