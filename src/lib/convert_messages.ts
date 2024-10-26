import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { Message } from './types';

export function convertToOpenAIFormat(message: BaseMessage): Message {
  const baseMessage = {
    id: crypto.randomUUID(),
    content: message.content as string,
    created_at: new Date().toISOString(),
    additional_kwargs: {},
    lc_namespace: [],
    lc_serializable: true,
    lc_aliases: [],
  };

  if (message instanceof HumanMessage) {
    return { ...baseMessage, role: 'user' };
  } else if (message instanceof AIMessage) {
    return { ...baseMessage, role: 'assistant' };
  } else if (message instanceof SystemMessage) {
    return { ...baseMessage, role: 'system' };
  }

  throw new Error(`Unknown message type: ${message.constructor.name}`);
}

export function convertFromOpenAIFormat(message: Message): BaseMessage {
  const baseProps = {
    content: message.content,
    additional_kwargs: {},
  };

  switch (message.role) {
    case 'user':
      return new HumanMessage(baseProps);
    case 'assistant':
      return new AIMessage(baseProps);
    case 'system':
      return new SystemMessage(baseProps);
    default:
      throw new Error(`Unknown role: ${message.role}`);
  }
}

export function convertLangchainMessages(messages: BaseMessage[]): Message[] {
  return messages.map(convertToOpenAIFormat);
}
