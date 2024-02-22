import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({}, { timestapms: true });

export const MedicalRecord = mongoose.model(
  'MedicalRecord',
  medicalRecordSchema
);
