

const express=require('express');

const Mongoose=require('mongoose');

const expressGraphQL=require('express-graphql').graphqlHTTP;

const {
    GraphQLTime,
    GraphQLDate,
     GraphQLDateTime } =require('graphql-iso-date');

require('dotenv').config();

const{

    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLNonNull
}=require('graphql');

Mongoose.connect(process.env.URL);

const app=express();


const employeeschema={
    data:{
        name:String,
        phone:String,
        email:String,
        aadharCard:String,
        voterCard:String,
        driverLicense:String,
        salary:String,
        salaryCycle:String,
        residentialAddress:String,
        employmentType:String,
    },
    employeeId:String,
    workspace:Mongoose.Types.ObjectId,
    status:Boolean,
    createdBy:String,
    isDeleted:Boolean,
    createdAt:Date,
    updatedAt:Date
};

const taskschema={
    data:{
    taskDescription:String,
    assignee:[String],
    taskStatus:String,
    startDate:String,
    dueDate:String
    },
    status:Boolean,
    createdAt:Date,
    updatedAt:Date,
    createdBy:String,
    workspace:Mongoose.Types.ObjectId,
};


const attendanceschema={
 
    employeeId:String,
    locationName:String,
    location: {
        type:{
        type: String,
        enum: ['Point', 'Polygon']
      },
      coordinates: [Number]
    },
    workspace:Mongoose.Types.ObjectId,
    date:Date,
    loginTime:String,
    logoutTime:String,
    present:Boolean,
    isLeave:Boolean,
    isHalfDay:Boolean,
    createdAt:Date,
    updatedAt:Date

}


const employees=Mongoose.model('employees',employeeschema);

const tasks=Mongoose.model('tasks',taskschema);

const attendances=Mongoose.model('attendances',attendanceschema);




const EmployeeType = new GraphQLObjectType({
    name: 'Employees',   
    description: 'This represents list of employees',
    fields: () => ({
        employeeId: {type: new GraphQLNonNull(GraphQLString) },
        data:{
            type:new GraphQLNonNull(new GraphQLObjectType({
                name:'employeeData',
                description:'This represents employee data',
                fields:()=>({
              
                    name: {  
                  
                type: new GraphQLNonNull(GraphQLString) },
                phone: { type:  GraphQLString },
                email: { type:  GraphQLString} ,
                aadharCard: { type:  GraphQLString },
                voterCard: { type: GraphQLString },
                driverLicense: { type:  GraphQLString },
                salary: { type:  GraphQLString },
                salaryCycle: { type:  GraphQLString },
                residentialAddress: { type:  GraphQLString },
                employmentType: { type:  GraphQLString },

                })
            }))

        },
        // workspace: { type: new GraphQLNonNull(GraphQLString) },
        createdAt:{type:GraphQLDateTime},
        updatedAt:{type:GraphQLDateTime},
        createdBy:{type:GraphQLString},
        // isDeleted:{type:GraphQLBoolean},
        status:{type:GraphQLBoolean},
        tasks: {
            type: new GraphQLList(TaskType),

        
            resolve(parent) {
            
                return tasks.find(
                    { workspace:parent.workspace,
                        "data.assignee":parent.employeeId
                    }
                   
                );
            }
        },
        attendances: {
            type: new GraphQLList(AttendanceType),

            resolve(parent) {
                return attendances.find(
                        { employeeId:parent.employeeId,
                        workspace:parent.workspace}

                );
            }
        }
    })
})

const TaskType = new GraphQLObjectType({
    name: 'Tasks',
    description: 'This represents list of tasks',
    fields: () => ({

        data:{
            type:new GraphQLNonNull(new GraphQLObjectType({
                name:'taskData',
                description:'This represents task data',
                fields:()=>({
                    taskDescription: { type:GraphQLString },
                    // assignee:{type:new GraphQLList(GraphQLString)},
                    taskStatus:{type:GraphQLString},
                    startDate:{type:GraphQLString},
                    dueDate:{type:GraphQLString}

                })
            }))


    },
    // workspace: { type: new GraphQLNonNull(GraphQLString) },
    createdBy: { type: new GraphQLNonNull(GraphQLString) },
    createdAt:{type:GraphQLDateTime},
    updatedAt:{type:GraphQLDateTime},
    status:{type:GraphQLBoolean}

})
})


const AttendanceType = new GraphQLObjectType({
    name: 'Attendances',
    description: 'This represents list of attendances',
    fields: () => ({
        employeeId: { type: new GraphQLNonNull(GraphQLString) },
        locationName: { type: GraphQLString},
        location:{
            type:new GraphQLNonNull(new GraphQLObjectType({
                name:'locationData',
                description:'This represents location data',
                fields:()=>({
                    type:{type:GraphQLString},
                    coordinates:{type:new GraphQLList(GraphQLFloat)}
                })
            }))
        },
        // workspace: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: GraphQLDate },
        loginTime: { type: GraphQLString },
        logoutTime: { type: GraphQLString},
        present: { type: new GraphQLNonNull(GraphQLBoolean) },
        isLeave: { type: new GraphQLNonNull(GraphQLBoolean) },
        isHalfDay: { type: new GraphQLNonNull(GraphQLBoolean) },
        createdAt:{type:GraphQLDateTime},
        updatedAt:{type:GraphQLDateTime}
})
})


            



const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        employee: {
            type:  EmployeeType,
            description: 'Single Employee',
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString } 
            },
            resolve (parent,args) {
                if(args.name){  
               return employees.findOne({"data.name":args.name,
                        isDeleted:false});
                }
                else if(args.id){
                    return employees.findOne({employeeId:args.id,
                        isDeleted:false});
                }
            }
        },
    
})

})


const schema=new GraphQLSchema({
    query: RootQueryType,
});



app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true,
  }));

app.listen(5000,()=>{console.log('Server running on port 5000')});

