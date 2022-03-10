const express=require('express');

const Mongoose=require('mongoose');

const expressGraphQL=require('express-graphql').graphqlHTTP;

require('dotenv').config();

const{

    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
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
    workspace:String,
};

const taskschema={
    data:{
    taskDescription:String,
    assignee:[String],
    taskStatus:String,
    },
    createdBy:String,
    workspace:String,
};



const employees=Mongoose.model('employees',employeeschema);

const tasks=Mongoose.model('tasks',taskschema);




const EmployeeType = new GraphQLObjectType({
    name: 'Employees',   
    description: 'This represents list of employees',
    fields: () => ({
        employeeId: { type: new GraphQLNonNull(GraphQLString) },
        data:{
            type:new GraphQLNonNull(new GraphQLObjectType({
                name:'employeeData',
                description:'This represents employee data',
                fields:()=>({
              name: { type: new GraphQLNonNull(GraphQLString) },
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
        workspace: { type: new GraphQLNonNull(GraphQLString) },
        tasks: {
            type: new GraphQLList(TaskType),
            resolve(parent) {
                return tasks.findOne({workspace:parent.workspace});
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
                    assignee:{type:new GraphQLList(GraphQLString)},
                    taskStatus:{type:GraphQLString},
                })
            }))

        // id: { type: new  GraphQLNonNull(GraphQLInt)},
        // name: { type: new GraphQLNonNull(GraphQLString )},
        // books:{type: new GraphQLList(BookType),
        //     resolve(parent){
        //         return books.find({authorId:parent.id})
        //     }
        // }
    },
    workspace: { type: new GraphQLNonNull(GraphQLString) },
    createdBy: { type: new GraphQLNonNull(GraphQLString) },
})
})



const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        employees: {
            type: new GraphQLList(EmployeeType),
            description: 'List of employees',
            resolve() {
                return  employees.find({});
            }    
        },
        tasks:{
            type: new GraphQLList(TaskType),
            description: 'List of tasks',
            resolve() {
                return tasks.find({});
            }
        },
        employee: {
            type:  EmployeeType,
            description: 'Single Employee',
            args: {
                id: { type: GraphQLString }
            },
            resolve (parent,args) {   
               return employees.findOne({employeeId:args.id});
            }
        }, 
        task:{
            type: TaskType,
            description: 'Single task',
            args: {
                id: { type: GraphQLString }
            },
            resolve (parent,args) {
                return tasks.findOne({
                   createdBy:args.id         
                 });
           }
        
     }

    
})

})


const schema=new GraphQLSchema({
    query: RootQueryType,
    // mutation: RootMutationType
});





app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true,
  }));

app.listen(5000,()=>{console.log('Server running on port 5000')});