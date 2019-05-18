import mongoose from 'mongoose';
import config from '../config';

mongoose.connect(config.mongo_address, { useNewUrlParser: true }).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});
mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() { console.log("Mongo On"); });

var ConfirmSchema = mongoose.Schema({
    phone: {type : String}, //휴대폰
    token : {type : String} //휴대폰 token
  });

require('./err')(ConfirmSchema);

let Confirm = mongoose.model("confirm", ConfirmSchema);

export { Confirm };

export default db;