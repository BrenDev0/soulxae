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
        email: "required",
        password: "required",
        name: "required",
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
      createAgent: {
        description: "required",
        name: "required",
        type: "ai or flow required"
      },
      updateAgent:{
        description: "optional",
        name: "optional",
        systemPrompt: "optional",
        greetingMessage: "optional",
        maxTokens: 200,
        temperature: 0.2
      },

      createAiConfig: {
        systemPrompt: "required",
        maxTokens: 200,
        temperature: 0.2
      },
      
      updateAiConfig: {
        systemPrompt: "optional",
        maxTokens: 200,
        temperature: 0.2
      },

      createFlowConfig: {
        provider: "required only voiceflow supported currently",
        apiKey: "required"
      },

      updateFlowConfig: {
        apiKey: "new key"
      },

      addAiTools: {
        agentId: "required",
        toolId: "required"
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
      createEmployee: {
        name: "required",
        email: "required",
        agentId: "required"
      },
      updateEmployee: {
        name: "optional",
        email: "optional",
        agentId: "optional"
      },

      uploadAgentDocs: {
        file: "formdata type file "
      },

      sendDirectMessage: {
        conversationId: "conversationId  required",
        type: "image, text, audio, document required",
        text: "message text, optional",
        media: ["media urls optional"],
        mediaType: "mime type, optional"
      }
    },
  },
};

const outputFile = './swagger.json';  
const endpointsFiles = [
  '../../modules/aiConfig/aiConfig.routes.ts',
  '../../modules/aiTools/aiTools.routes.ts',
  '../../modules/agents/agents.routes.ts',
  '../../modules/clients/clients.routes.ts',
  '../../modules/conversations/conversations.routes.ts',
  '../../modules/directMessaging/directMessaging.routes.ts',
  '../../modules/employees/employees.routes.ts',
  '../../modules/flowConfig/flowConfig.routes.ts',
  '../../modules/platforms/platforms.routes.ts',
  '../../modules/users/users.routes.ts'
  
];    


swaggerAutogen(options)(outputFile, endpointsFiles, doc);