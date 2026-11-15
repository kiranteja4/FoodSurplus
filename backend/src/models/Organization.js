import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Organization = mongoose.models.Organization
  ?? mongoose.model('Organization', organizationSchema);

export default Organization;
