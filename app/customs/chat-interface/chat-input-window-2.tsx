'use client';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSpeechButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputHeader,
  PromptInputFooter,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import {
  Message, 
  MessageContent, 
  MessageResponse ,
  MessageActions,
  MessageAction,
} from '@/components/ai-elements/message';
import { GlobeIcon, Sparkles, User, Copy, RefreshCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { useTheme, THEME_STYLES } from '@/app/context/ThemeContext';
import { MessageRole } from '@/app/types';

const models = [
  { id: 'gpt-4o', name: 'GPT-4o' },
  { id: 'claude-opus-4-20250514', name: 'Claude 4 Opus' },
];

// =============================================================================
// THEME HELPER - CHeck if theme is dark
// =============================================================================
const isDarkTheme = (theme: string): boolean => {
  return theme === 'black' || theme === 'dark_blue';
};

// =============================================================================
// AVATAR COMPONENT
// =============================================================================
interface AvatarProps {
  role: MessageRole;
  theme: string,
  themeStyle: Record<string, string>;
}

const Avatar = ({ role, theme, themeStyle }: AvatarProps) => {
  const isUser = role === 'user';
  const isSystem = role === 'system';
  const isDark = isDarkTheme(theme);

  // assitant avatar styles based on theme
  const getAssistantAvatarStyle = () => {
    if (isDark) {
      // Dark theme: white bg, dark icon
      return {
        backgroundColor: '#ffffff',
        color: '#1f2937', // dark gray
      };
    }else {
      // Light themes: keep the gradient (handled by className)
      return undefined;
    }

  }
  return (
    <div
      className={`
        flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-sm font-medium
        transition-all duration-200
        ${isUser 
          ? ''
          : isDark
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
            : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm'
        }
      `}
      style={isUser 
        ? { 
          backgroundColor: themeStyle.color,
          color: themeStyle.backgroundColor 
        }
        : getAssistantAvatarStyle()
      }
    >
      {isUser ? <User size={16} /> : <Sparkles size={16} />}
    </div>
  );
};

// =============================================================================
// ROLE LABEL COMPONENT
// =============================================================================
interface RoleLabelProps {
  role: MessageRole;
}

const RoleLabel = ({ role }: RoleLabelProps) => (
  <div className={`text-xs font-medium opacity-60 mb-1.5 ${role === 'user' ? 'text-right' : ''}`}>
    {role === 'user' ? 'You' : 'Assistant'}
  </div>
);

// =============================================================================
// MESSAGE ACTIONS COMPONENT
// =============================================================================
interface MessageActionsBarProps {
  content: string;
  isLatest: boolean;
  onRegenerate?: () => void;
}

const MessageActionsBar = ({ content, isLatest, onRegenerate }: MessageActionsBarProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
        title="Copy"
      >
        <Copy size={14} />
      </button>
      {isLatest && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
          title="Regenerate"
        >
          <RefreshCcw size={14} />
        </button>
      )}
      <button
        className="p-1.5 rounded-md text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
        title="Good response"
      >
        <ThumbsUp size={14} />
      </button>
      <button
        className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        title="Bad response"
      >
        <ThumbsDown size={14} />
      </button>
      {copied && (
        <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2 animate-fade-in">
          Copied!
        </span>
      )}
    </div>
  );
};

// =============================================================================
// STYLED MESSAGE WRAPPER
// =============================================================================
interface StyledMessageProps {
  message: {
    id: string;
    role: MessageRole;
    parts: Array<{ type: string; text?: string }>;
  };
  isLatest: boolean;
  theme: string,
  themeStyle: Record<string, string>;
  onRegenerate?: () => void;
}

const StyledMessage = ({ message, isLatest, theme, themeStyle, onRegenerate }: StyledMessageProps) => {
  const isDark = isDarkTheme(theme);
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const textContent = message.parts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('\n');

  // Get user message bubble styles based on theme
  const getUserBubbleStyle = () => {
    if (isDark) {
       // Dark themes: light-gray background
      return {
        backgroundColor: '#ffffff', // light-gray (gray-300)
        color: '#1f2937', // dark-gray text
      };
    } else {
      // Light themes: dark-gray background
      return {
        backgroundColor: '#4b5563', // dark-gray (gray-600)
        color: '#ffffff', // white text
      };
    }
  };

  // Handle copy action
  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
  };

  return (
    <div className={`group flex gap-3 ${isUser ? 'flex-row-reverse' : ''} py-4`}>
      {/* Avatar */}
      <Avatar 
        role={message.role} 
        theme={theme}
        themeStyle={themeStyle} 
      />

      {/* Content */}
      <div className={`flex-1 min-w-0 ${isUser ? 'flex flex-col items-end' : ''}`}>
        {/* Role Label */}
        <RoleLabel role={message.role} />

        {/* Message Bubble */}
        <div
          className={`
            ${isUser
              ? 'flex flex-col gap-4' //'rounded-2xl rounded-tr-md px-4 py-3 shadow-sm [&_.is-user]:bg-transparent [&_*]:bg-transparent'
              : 'max-w-full [&_.is-assistant]:bg-transparent [&_*]:bg-transparent'
            }
          `}
          style={isUser 
            ? getUserBubbleStyle()
            : undefined}
        >
          <Message from={message.role}
            className="!bg-transparent [&>*]:!bg-transparent"
            style={{ backgroundColor: 'transparent' }}
          >
            <MessageContent
              className="!bg-transparent [&>*]:!bg-transparent"
              style={{ backgroundColor: 'transparent' }}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <MessageResponse key={`${message.id}-${i}`}>
                        {part.text}
                      </MessageResponse>
                    );
                  default:
                    return null;
                }
              })}
            </MessageContent>
          </Message>
        </div>

        {/* Actions for assistant messages - using AI Elements components */}
        {!isUser && (
          <MessageActions className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <MessageAction
              onClick={handleCopy}
              label="Copy"
            >
              <Copy className="size-3" />
            </MessageAction>
            {isLatest && onRegenerate && (
              <MessageAction
                onClick={onRegenerate}
                label="Regenerate"
              >
                <RefreshCcw className="size-3" />
              </MessageAction>
            )}
            <MessageAction
              onClick={() => console.log('Positive feedback')}
              label="Good response"
            >
              <ThumbsUp className="size-3" />
            </MessageAction>
            <MessageAction
              onClick={() => console.log('Negative feedback')}
              label="Bad response"
            >
              <ThumbsDown className="size-3" />
            </MessageAction>
          </MessageActions>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// LOADING INDICATOR
// =============================================================================
interface LoadingIndicatorProps {
  theme: string;
  themeStyle: Record<string, string>;
}

const LoadingIndicator = ({ theme, themeStyle }: LoadingIndicatorProps) => {
  const isDark = isDarkTheme(theme);

  return (
    <div className="flex gap-3 py-4">
    <div className={`
      flex items-center justify-center w-8 h-8 rounded-full shrink-0 shadow-sm
      ${isDark ? '' : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'}
      `}
      style={isDark ? { backgroundColor: '#ffffff', color: '#1f2937' } : undefined}
      >
      <Sparkles size={16} />
    </div>
    <div>
      <div className="text-xs font-medium opacity-60 mb-1.5">Assistant</div>
      <div className="flex items-center gap-1.5 py-2">
        <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
         style={{ 
            animationDelay: '0ms',
            backgroundColor: isDark ? '#9ca3af' : '#a78bfa'
          }} 
        />
        <div 
            className="w-2 h-2 rounded-full animate-bounce" 
            style={{ 
              animationDelay: '150ms',
              backgroundColor: isDark ? '#9ca3af' : '#a78bfa'
            }} 
          />
          <div 
            className="w-2 h-2 rounded-full animate-bounce" 
            style={{ 
              animationDelay: '300ms',
              backgroundColor: isDark ? '#9ca3af' : '#a78bfa'
            }} 
          />
      </div>
    </div>
  </div>
  );
};

// =============================================================================
// EMPTY STATE
// =============================================================================
interface EmptyStateProps {
  theme: string;
  themeStyle: Record<string, string>;
  onSuggestionClick: (text: string) => void;
}

const EmptyState = ({ theme, themeStyle, onSuggestionClick }: EmptyStateProps) => {
  const isDark = isDarkTheme(theme);
  const suggestions = [
    "What can you help me with?",
    "Tell me about yourself",
    "How does this work?",
    "What are your capabilities?",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className={`
        flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-6
        ${isDark ? '': 'bg-gradient-to-br from-violet-500 to-purple-600'}
      `}>
        <Sparkles size={32} style={{ color: isDark ? '#1f2937' : '#ffffff' }} />
      </div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: themeStyle.color }}>
        Start a conversation
      </h2>
      <p className="text-sm opacity-60 mb-6 text-center max-w-md" style={{ color: themeStyle.color }}>
        Ask me anything. I'm here to help with questions, tasks, and creative projects.
      </p>
      
      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-4 py-2 rounded-full text-sm border transition-all duration-200 hover:scale-105"
            style={{
              borderColor: themeStyle.navbarBorder,
              color: themeStyle.color,
              backgroundColor: 'transparent',
            }}
            // onMouseEnter={(e) => {
            //   e.currentTarget.style.backgroundColor = themeStyle.navbarBorder;
            // }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const ChatInputWindowComponent = () => {
  const [text, setText] = useState<string>('');
  const [model, setModel] = useState<string>(models[0].id);
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, status, sendMessage } = useChat();

  const { theme } = useTheme();
  const themeStyle = THEME_STYLES[theme];

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || 'Sent with attachments',
        files: message.files,
      },
      {
        body: {
          model: model,
          webSearch: useWebSearch,
        },
      }
    );
    setText('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <div
      className="w-full h-1/2 md:h-full flex flex-col rounded-xl border shadow-sm overflow-hidden"
      style={{
        backgroundColor: themeStyle.backgroundColor,
        borderColor: themeStyle.navbarBorder,
        color: themeStyle.color,
      }}
    >
      {/* Conversation Area */}
      <Conversation className="flex-1 min-h-0 overflow-y-auto">
        <ConversationContent className="px-4">
          {messages.length === 0 ? (
            <EmptyState 
              theme={theme}
              themeStyle={themeStyle} 
              onSuggestionClick={handleSuggestionClick} 
            />
          ) : (
            <>
              {messages.map((message, index) => (
                <StyledMessage
                  key={message.id}
                  message={message}
                  isLatest={index === messages.length - 1 && message.role === 'assistant'}
                  theme={theme}
                  themeStyle={themeStyle}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <LoadingIndicator theme={theme} themeStyle={themeStyle} />
              )}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input Area */}
      <div 
        className="w-full px-4 pb-4"
        style={{border: 'none'}}
        // style={{ borderColor: themeStyle.navbarBorder }}
      >
        <PromptInput onSubmit={handleSubmit} 
          globalDrop 
          multiple
        >
          <PromptInputHeader>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              ref={textareaRef}
              value={text}
              placeholder="Send a message..."
              style={{
                backgroundColor: 'transparent',
                color: themeStyle.color,
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
              }}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputSpeechButton
                onTranscriptionChange={setText}
                textareaRef={textareaRef}
              />
              <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                variant={useWebSearch ? 'default' : 'ghost'}
                className={useWebSearch ? 'bg-violet-500 hover:bg-violet-600 text-white' : ''}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}
              >
                <PromptInputSelectTrigger>
                  <PromptInputSelectValue />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {models.map((model) => (
                    <PromptInputSelectItem key={model.id} value={model.id}>
                      {model.name}
                    </PromptInputSelectItem>
                  ))}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit disabled={!text && !status} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>

      {/* Footer */}
      <div 
        className="text-center py-2 text-[10px] opacity-40 border-t"
        style={{ 
          borderColor: themeStyle.navbarBorder,
          color: themeStyle.color 
        }}
      >
        AI can make mistakes. Please verify important information.
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export const ChatInputWindow = React.memo(ChatInputWindowComponent);