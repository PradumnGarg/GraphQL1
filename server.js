const express = require("express");

const Mongoose = require("mongoose");

const expressGraphQL = require("express-graphql").graphqlHTTP;

const {
  GraphQLTime,
  GraphQLDate,
  GraphQLDateTime,
} = require("graphql-iso-date");

require("dotenv").config();

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
} = require("graphql");
const { response } = require("express");

Mongoose.connect("mongodb://localhost:27017/Multiply1DB");

const app = express();

const employeeschema = {
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



const employees = Mongoose.model("employees", employeeschema);

const EmployeeType = new GraphQLObjectType({
  name: "Employees",
  description: "This represents list of employees",
  fields: () => ({
    _id: { type: GraphQLString },
    schemaversion: { type: GraphQLInt },
    name: { type: GraphQLString },
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
    address: {
      type: new GraphQLNonNull(
        new GraphQLObjectType({
          name: "Address",
          description: "This represents list of address",
          fields: () => ({
            permanentAddress: {
              type: new GraphQLObjectType({
                name: "PermanentAddress",
                description: "This represents list of permanent address",
                fields: () => ({
                  line1: { type: GraphQLString },
                  city: { type: GraphQLString },
                  state: { type: GraphQLString },
                  country: { type: GraphQLString },
                  zipcode: { type: GraphQLString },
                }),
              }),
              isCommunicationAddressSameAsPermanentAddress: {
                type: GraphQLBoolean,
              },
            },
            communicationAddress: {
              type: new GraphQLObjectType({
                name: "CommunicationAddress",
                description: "This represents list of communication address",
                fields: () => ({
                  line1: { type: GraphQLString },
                  city: { type: GraphQLString },
                  state: { type: GraphQLString },
                  country: { type: GraphQLString },
                  zipcode: { type: GraphQLString },
                }),
              }),
            },
          }),
        })
      ),
    },
    dateofBirth: { type: GraphQLDate },
    governmentIds: {
      type: new GraphQLNonNull(
        new GraphQLObjectType({
          name: "GovernmentIds",
          description: "This represents list of government ids",
          fields: () => ({
            pan: { type: GraphQLString },
            aadhar: { type: GraphQLString },
            passport: { type: GraphQLString },
            voterId: { type: GraphQLString },
            drivingLicense: { type: GraphQLString },
          }),
        })
      ),
    },
    employmentType: { type: GraphQLString },
    salaryDetails: {
      type: new GraphQLObjectType({
        name: "SalaryDetails",
        description: "This represents salary details",
        fields: () => ({
          salary: { type: GraphQLInt },
          salaryCurrency: { type: GraphQLString },
          salaryFrequency: { type: GraphQLString },
          settlementDetails: {
            type: new GraphQLObjectType({
              name: "SettlementDetails",
              description: "This represents settlement details",
              fields: () => ({
                paymentDay: { type: GraphQLString },
                paymentTime: { type: GraphQLString },
              }),
            }),
          },
        }),
      }),
    },
    financialDetails: {
      type: new GraphQLObjectType({
        name: "FinancialDetails",
        description: "This represents financial details",
        fields: () => ({
          bankAccounts: {
            type: new GraphQLList(
              new GraphQLObjectType({
                name: "BankAccounts",
                description: "This represents bank accounts",
                fields: () => ({
                  accountNumber: { type: GraphQLString },
                  accountType: { type: GraphQLString },
                  bankName: { type: GraphQLString },
                  ifscCode: { type: GraphQLString },
                  depositRatio: { type: GraphQLInt },
                }),
              })
            ),
          },
        }),
      }),
    },
    educationDetails: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "EducationDetails",
          description: "This represents education details",
          fields: () => ({
            qualification: { type: GraphQLString },
            institute: { type: GraphQLString },
            university: { type: GraphQLString },
            yearOfPassing: { type: GraphQLString },
            percentage: { type: GraphQLInt },
          }),
        })
      ),
    },
    experienceDetails: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "ExperienceDetails",
          description: "This represents experience details",
          fields: () => ({
            companyName: { type: GraphQLString },
            designation: { type: GraphQLString },
            startDate: { type: GraphQLString },
            endDate: { type: GraphQLString },
            location: { type: GraphQLString },
            description: { type: GraphQLString },
          }),
        })
      ),
    },
    isSuperAdmin: { type: GraphQLBoolean },
    isDeleted: { type: GraphQLBoolean },
    isBusinessOwner: { type: GraphQLBoolean },
    manager: { type: GraphQLString },
    workspace: { type: GraphQLString },
    status: { type: GraphQLBoolean },
    createdBy: { type: GraphQLString },
    isDeleted: { type: GraphQLBoolean },
    createdAt: { type: GraphQLDate },
    updatedAt: { type: GraphQLDate },
    employeeId: { type: GraphQLString },
    identifiers: {
        type: new GraphQLObjectType({
            name: "Identifiers",
            description: "This represents identifiers",
            fields: () => ({
                employeeId: { type: GraphQLString },
                workspace: { type: GraphQLString },
            })
        })
    },
    // employeeDetails: {
    //     type: new GraphQLObjectType({
    //         name: "EmployeeDetails",
    //         description: "This represents employee details",
    //         fields: () => ({
    //             identifiers: {
    //                 type: new GraphQLObjectType({
    //                     name: "Identifiers",
    //                     description: "This represents identifiers",
    //                     fields: () => ({
    //                         employeeId: { type: GraphQLString },
    //                         workspace: { type: GraphQLString },
    //                     })
    //                 })
    //             }
    //         })
    //     })
    // }
   
  }),
});

const arrayOfObject = [];
const arrayOfObject1 = [];
const outerObject1 = {};
const outerObject = {};
const arrayOfObject2=[];


const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    employee: {
      type: new GraphQLList(EmployeeType),
      description: "List of Employees",
      args: {
        query: { type: GraphQLString },
      },
       resolve(parent, args) {
        return  employees.find({
          $or: [{ name: args.query }, { employeeId: args.query }],
          isDeleted: false,
        }).then(response => { return response.map((x) => {
            const { employeeId, workspace, _id ,...rest} = JSON.parse(JSON.stringify(x));
            outerObject.identifier={employeeId,workspace,_id}
            outerObject.attributeset={...rest};
            
            
            console.log(outerObject);
            return outerObject;
            // return {identifiers: {employeeId,workspace,_id}};

        })});

        
    //    return employeesQuerySet.map((entry) => {  
    //         const { employeeId, workspace, _id } = JSON.parse(JSON.stringify(entry));
    //         // const { employeeId,workspace,_id...rest} = entry;
    //         arrayOfObject.push({ employeeId, workspace, _id });
    //         // arrayOfObject1.push(rest);
    //         outerObject.identifier={employeeId,workspace,_id};
    //         // outerObject1.attributeset=arrayOfObject1;
    //         // outerObject2=JSON.stringify(outerObject)+JSON.stringify(outerObject1);
            
    //         console.log(outerObject);
    //         return outerObject;
            
    //     });
       
        // outerObjcect.identifier=arrayOfObject;
        // return outerObjcect;

        // console.log(arrayOfObject);
        // const { employeeId, workspace, _id } = employeesQuerySet;

        // return employeesQuerySet.map((employee) => {
        //   let { employeeId, workspace } = employee;
        //   return { identifiers: { employeeId, workspace } };
        // });

        //     .then(response=> response.map(x=>{

        //         const {employeeId,workspace} = x;
        //    const newdata={
        //        identifiers:{
        //            employeeId,
        //            workspace
        //        }
        //    }
        //     return newdata;

        // })

        // )
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
