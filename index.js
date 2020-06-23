const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");

// Bring in the app constants
const { DB, PORT } = require("./config");

// Initialize the application
const app = exp();

//middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require('./middlewares/passport')(passport)

//User Router Middleware
app.use('/api/users', require('./routes/users'))

//connection with db
const startApp = async () => {
    try {
        await connect(DB, {
            useUnifiedTopology: true,
            useFindAndModify: true,
            useNewUrlParser: true
        })
        success({
            message: `Suceessfullly connected to DB \n${DB}`,
            badge: true
        })
        app.listen(PORT, () =>
            success({ message: `Server started on PORT ${PORT}`, badge: true })
        );
    } catch (err) {
        error({
            message: `unable to connect to DB, Trying to reconnect \n${err}`,
            badge: true
        })
        startApp();
    }
};

startApp();