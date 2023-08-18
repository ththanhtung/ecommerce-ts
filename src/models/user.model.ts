import mongoose, { Model } from "mongoose"

const COLLECTION_NAME = 'Users'
const DOCUMENT_NAME = 'User'

interface UserAttrs {
    user_name: string
    user_email: string
    user_password: string
    user_phone: number
    user_address: string
    user_has_shop: boolean
}

interface UserDocs extends mongoose.Document {
  user_name: string;
  user_email: string;
  user_password: string;
  user_phone: number;
  user_address: string;
  user_has_shop: boolean;
  createAt: Date;
  updatedAt: Date
}

interface UserModel extends Model<UserDocs> {
  build(attrs: UserAttrs): UserDocs;
}

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    user_phone: {
        type: Number,
    },
    user_has_shop: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true, 
    collection: COLLECTION_NAME
})

userSchema.statics.build = (attrs: UserAttrs)=>{
    return new User(attrs)
}

const User = mongoose.model<UserDocs, UserModel>(DOCUMENT_NAME, userSchema);