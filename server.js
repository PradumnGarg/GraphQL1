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

const employeeSchema=require("./schema/schema.js");


const employees = Mongoose.model("employees", employeeSchema);

//GraphQL schema structure
const EmployeeType = new GraphQLObjectType({
  name: "Employees",
  description: "This represents list of employees",
  fields: () => ({

    attributeSet:{
      type:new GraphQLObjectType({
      name:"attributeSet",
      description:"This represents list of attributes",
      fields:()=>({
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
        status: { type: GraphQLBoolean },
        createdBy: { type: GraphQLString },
        isDeleted: { type: GraphQLBoolean },
        createdAt: { type: GraphQLDate },
        updatedAt: { type: GraphQLDate },
      })
    }),
  },
   
    identifiers: {
        type: new GraphQLObjectType({
            name: "Identifiers",
            description: "This represents identifiers",
            fields: () => ({
              _id: { type: GraphQLString },  
              employeeId: { type: GraphQLString },
                workspace: { type: GraphQLString },

            })
        })
    },
  

   
  }),
});


// Query to get desired attributes of employee list
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
            return { identifiers: { employeeId, workspace,_id } ,
          attributeSet: rest };
          })
        });
  
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
