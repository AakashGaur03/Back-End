import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    experianceInYears: {
      type: Number,
      default: 0,
    },
    worksInHospitals: [
      {
        type: mongoose.Scheama.Types.ObjectId,
        ref: 'Hospital',
      },
    ],
  },
  { timestapms: true }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
