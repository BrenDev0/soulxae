export interface MessengerButton {
  type: string;
  title: string;
  payload: string;
}

export interface MessengerTemplateElements {
  title?: string;
  image_url?: string;
  subtitle?: string;
  buttons?: MessengerButton[]
}

export interface TemplatePayload {
  type: string
  payload: {
    template_type: string,
    elements: MessengerTemplateElements
  }
}

export interface MediaAttachment {
  type: string;
  payload: {
    url: string,
    is_reusable?: Boolean
  }
}

export interface IncommingMessengerAttachment {
  type: string;
  payload: {
    url: string;
  }
}

export interface MessengerObject {
  recipient:{
    id: string
  },
  messaging_type?: string,
  message: {
    text?: string,
    quickReplies?: [];
    attachments?: MediaAttachment[],
    attachment?: TemplatePayload | MediaAttachment
  }
}

