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
        apiKey: "required for type flow",
        description: "required",
        name: "required",
        workspaceId: "required",
        agentType: "direct or flow"
      },
      updateAgent:{
        name: "new name",
        description: "new description",
        apiKey: "new api key"
      },
      createPlatform: {
        agentId: "required",
        platform: "whatsapp or  messenger or instagram",
        token: "system user token form meta",
        identifier: "from api connections in meta developers app"
      },
      updatePlatform: {
        token: "new token",
        platform: "new platform"
      },

      sendDirectMessage: {
        message: {
          conversationId: "conversationId",
          type: "image, text",
          content: {
            body: "See interfaces at bottom of docs for proper structures"
          }
        }
      },

      TextContent: {
        body: "message text"
      },
      ImageContent: {
        url: "image url",
        caption: "optional message"
      }
    },
    
  },
};

const outputFile = './swagger.json';  
const endpointsFiles = [
  '../../modules/agents/agents.routes.ts',
  '../../modules/clients/clients.routes.ts',
  '../../modules/conversations/conversations.routes.ts',
  '../../modules/directMessaging/directMessaging.routes.ts',
  '../../modules/platforms/platforms.routes.ts',
  '../../modules/users/users.routes.ts',
  '../../modules/workspaces/workspaces.routes.ts'
  
];    


swaggerAutogen(options)(outputFile, endpointsFiles, doc);