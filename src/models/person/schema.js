import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import timestamp from 'mongoose-timestamp';

const Schema = mongoose.Schema;

const personSchema = new Schema({
  name: {
    type:String,
    required:true,
    trim:true
  },
  uid: {
    type:String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required:true
  },
  badges:[{
    badge:{
      type: Schema.Types.ObjectId,
      ref: 'Badge'
    },
    awardedOn:{
      type: Date
    }
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

personSchema.plugin(timestamp);

personSchema.virtual('stations', {
  ref: 'Station',
  localField: '_id',
  foreignField: 'owner'
});

personSchema.pre('save', function(next){
  //const saltRounds = 10;
  console.log("Pre save person hook");
  this.wasNew = this.isNew;

  //next();
  if(this.isModified('password') || this.isNew){
    bcrypt.genSalt(5, (err,salt) => {
      if(err) return next(err);
      bcrypt.hash(this.password, salt, null, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    return next();
  }

});

personSchema.methods.comparePassword = (passw) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passw, this.password, (err, isMatch) => {
      if(err) return reject(err);
      resolve(isMatch);
    });
  });
};

/*personSchema.methods.comparePassword = (passw, cb) => {
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};*/

export default personSchema;