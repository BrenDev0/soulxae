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
  template_type: string,
  elements: MessengerTemplateElements
}

export interface MediaPayload {
  url: string,
  is_reusable: Boolean
}

export interface MessengerObject {
  recipient:{
    id: string
  },
  messaging_type?: string,
  message: {
    text?: string,
    quickReplies?: [];
    attachment?: {
      type: string,
      payload: TemplatePayload | MediaPayload
    }
  }
}

