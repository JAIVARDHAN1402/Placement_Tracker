import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    status: {
      type: String,
      enum: ["Applied", "OA Cleared", "Interview", "Rejected", "Selected", "Withdrawn"],
      default: "Applied",
    },
    appliedDate: { type: String, required: true },
    source: { type: String, enum: ["campus", "self", "tracker"], default: "tracker" },
    failureStage: { type: String, enum: ["OA", "Interview", null], default: null },
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application || mongoose.model("Application", applicationSchema);
export default Application;