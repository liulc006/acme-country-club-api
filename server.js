const express = require('express');
const app = express();

app.use('/api', require('./api')); //From router

const setup = async() => {
    try{
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`listening to port ${PORT}`));
    }
    catch(err){
        console.log(err);
    }
};

setup();

