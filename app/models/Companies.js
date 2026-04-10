import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    package: { type: String, required: true },
    deadline: { type: String, required: true },
    location: { type: String, required: true },
    mode: { type: String, enum: ["Remote", "Hybrid", "On-site"], default: "Hybrid" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isGlobal: { type: Boolean, default: false },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

const Company = mongoose.models.Company || mongoose.model("Company", companySchema);
export default Company;