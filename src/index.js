const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true },(err)=>{
  if(!err){
    console.log('Connected')
  }else{
    console.log(err)
  }
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
