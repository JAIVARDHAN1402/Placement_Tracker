import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ye  toh scheme design hua h
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    branch: { type: String, default: "" },
  },
  { timestamps: true }
);

// ye pwd ko hashing krne k liye -- db mei save hone se phle hash ho uske baad store ho
userSchema.pre("save", async function () { // pre ka wahi mtlb h store hone se phle hash ho jaaye pwd
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12); // 12 number of times hash kr rha h pwd ko
});

// hashed pwd ko compare krre h dekhne k liye ki sahi login credential h n
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ye krre qki server se client ko data jata h usmei pwd hidden rhe iske liye ye krre h
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
