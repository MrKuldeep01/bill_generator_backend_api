import app from './app.js'
import config from '../config/config.js'
import dotenv from 'dotenv'
dotenv.config();
import connectToDB from './db/index.js'
let port = config.port || 3000;

connectToDB().then(()=>{
    app.listen(port,()=>{
        console.log('Application is listening on : '+ port);
    })
}).catch((error)=>{
    console.error(`Error: we are facing issue in our application :- ${error}`);
})
