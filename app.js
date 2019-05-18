import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '1gb',
    extended: false
}));

//module setting
import { Confirm } from './mongo';

// Initialize swagger-jsdoc -> returns validated swagger spec in json format

//서버 실행
const PORT = config.PORT || 5000;
app.listen(PORT, function() {
    console.log('server running in ' + PORT);
});

require('./routes/auth/phone')(app, Confirm);
// require('./routes/index')(app);