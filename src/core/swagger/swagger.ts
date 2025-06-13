import swaggerAutogen from 'swagger-autogen';
const options = {
  openapi: "3.0.0" 
 
};

const doc = {
  info: {
    title: 'Soulxae',
    description: 'Endpoints',
    version: '1.0.0',  
  },
  host: 'soulxae.up.railway.app',
  basePath: '/',  
  schemes: ['https'],
  paths: {}, 
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Enter JWT token with **Bearer** prefix. Example: "Bearer {token}"'
      }
    },
    schemas: {
      createUser: {
        email: "email",
        password: "password",
        code: "code from users email"
      },
      updateUser: {
        subscription: "new sub",
        password: "new passoword",
        oldPassword: "old password"
      },
      verifiedUpdateUser: {
        email: "new email",
        password: " new password",
        code: "code from users email"
      },
      login: {
        email: "email",
        password: "password"
      },
      accountRecovery: {
        email: "email"
      },
      verifyEmail: {
        email: "new email"
      },
      createWorkspace: {
        name: "name"
      },
      updateWorkspace: {
        name: "new name"
      },
      createAgent: {
        apiKey: "required for type bot",
        description: "required",
        name: "required",
        workspaceId: "required",
        agentType: "bot, or human"
      },
      updateAgent:{
        name: "new name",
        description: "new description",
        apiKey: "new api key"
      },
      createPlatform: {
        agentId: "required",
        platform: "whatsapp, messenger, instagram, direct(for human agents)",
        token: "system user token form meta",
        identifier: "from api connections in meta developers app"
      },
      updatePlatform: {
        token: "new token",
        platform: "new platform"
      }
    },
    
  },
};

const outputFile = './swagger.json';  
const endpointsFiles = [
  '../../modules/agents/agents.routes.ts',
  '../../modules/clients/clients.routes.ts',
  '../../modules/conversations/conversations.routes.ts',
  '../../modules/platforms/platforms.routes.ts',
  '../../modules/users/users.routes.ts',
  '../../modules/workspaces/workspaces.routes.ts'
  
];    


swaggerAutogen(options)(outputFile, endpointsFiles, doc);