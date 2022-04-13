const Mongoose = require("mongoose");

const employeeSchema = {
    _id: String,
    schemaversion: Number,
    name: String,
    phone: String,
    email: String,
  
    address: {
      permanentAddress: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        country: String,
        zipcode: String,
        _id: Mongoose.Schema.Types.ObjectId,
      },
      isCommunicationAddressSameAsPermanentAddress: Boolean,
      communicationAddress: {
        line1: String,
        city: String,
        state: String,
        country: String,
        zipcode: String,
        _id: Mongoose.Schema.Types.ObjectId,
      },
    },
  
    dateofBirth: Date,
  
    governmentIds: {
      pan: String,
      aadhar: String,
      passport: String,
      voterId: String,
      drivingLicense: String,
    },
  
    employmentType: String,
  
    salaryDetails: {
      salary: Number,
      salaryCurrency: String,
      salaryFrequency: String,
      settlementDetails: {
        paymentDay: String,
        paymentTime: String,
      },
    },
  
    financialDetails: {
      bankAccounts: [
        {
          _id: Mongoose.Schema.Types.ObjectId,
          accountNumber: String,
          accountType: String,
          bankName: String,
          ifscCode: String,
          depositRatio: Number,
          _id: Mongoose.Schema.Types.ObjectId,
        },
      ],
    },
  
    educationDetails: [
      {
        _id: Mongoose.Schema.Types.ObjectId,
        qualification: String,
        institute: String,
        university: String,
        yearOfPassing: String,
        percentage: Number,
      },
    ],
  
    experienceDetails: [
      {
        _id: Mongoose.Schema.Types.ObjectId,
        companyName: String,
        designation: String,
        startDate: String,
        endDate: String,
        location: String,
        description: String,
      },
    ],
  
    isSuperAdmin: Boolean,
    isDeleted: Boolean,
    isBusinessOwner: Boolean,
    manager: String,
    workspace: Mongoose.Types.ObjectId,
    status: Boolean,
    createdBy: String,
    isDeleted: Boolean,
    createdAt: Date,
    updatedAt: Date,
    employeeId: String,
  };

 module.exports = employeeSchema;