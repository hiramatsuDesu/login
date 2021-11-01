var mongoose = require('mongoose');
var bcrypt = require('bcrypt');


var UserSchema = new mongoose.Schema({
    email: {
        type:String,
        unique: true,
        required: true,
        trim: true,
        minlength: 5
    },
    username:{
        type:String,
        required: true,
        trim: true,
        minlength:6
    },
    password:{
        type:String,
        required: true,
        trim: true,
        minlength:8
    },
    createdom: {
        type: Date,
        default: Date.now
    }
});

//authenticate que luego llamare en users
UserSchema.statics.authenticate = async function(email, pass, callback){
    try{
        let userDB = await User.findOne({email: email});
        if(!userDB)
        {
            return{error: "Usuario no encontrado", email: null};
        }
        let result = await bcrypt.compareSync(pass, userDB.password);
        if(result)
        {
            return{error: null, user: userDB};
        }else{
            return {error: "Clave o usuario inexistente", user: null}
        };
    }catch(ex)
    {
        return{error: ex.message, user: null};
    }
}

//presave - encriptacion
UserSchema.pre('save', async function(next){
    try{
        var user = this;
        let hash = await bcrypt.hashSync(user.password, 10);
        user.password = hash;
        next();
    }catch(ex){
        next(ex);
    }
});

var User = mongoose.model("User", UserSchema);
module.exports = User;