import { UUID } from "mongodb";
import mongoose, {Schema} from "mongoose";
const userSchema = new Schema({
    "id" : {
        type: UUID,
        default: () => new UUID(),
        unique: true
    }
    ,
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 5,
        maxLength: 20
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    displayName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    lastLogin: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lockedUntil: {
        type: Date,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    refreshTokenExpiry: {
        type: Date,
        default: null
    }
}, {timestamps: true});
export default mongoose.model("User", userSchema);