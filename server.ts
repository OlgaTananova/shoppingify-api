import mongoose from "mongoose";
import app from './app';

const { PORT = 3000, MONGO_URI } = process.env;

mongoose.connect(MONGO_URI || 'mongodb://localhost:27017/shoppingify_dev');
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});

