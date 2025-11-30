/**
useContext allows a component to subscribe to a context value created by React.createContext().
A context typically provides global/shared data to multiple components, such as:
- authenticated user info
- theme (dark/light mode)
- language settings
- app-wide config
- global state store (if not using Redux/Zustand/Jotai)
 
*/

"use client";

import {
    createContext, // useContext is a React Hook that lets you read values from a React Context inside your components without passing props manually through every level (“prop drilling”).
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

// import {  useToast } from "@/app/hooks/useToast";
import { v4 as uuidv4 } from "uuid";
import { ModelOptions } from "@/app/types";
import { useQueryState } from "nuqs";
// import { pageMessageData } from "@/app/hooks/pageMessageData";
// import { useRuns } from "@/app/hooks/useRuns";
// import { useUser } from "@/app/hooks/useUser";
// import { messageContentToText } from "@/app/utils/convert_messages";

export interface ChatPageInput { 
    messages?: Record<string, any>[];
}

interface ChatPageData { 
    runId: string | null;
    isStreaming: boolean;
    // messages: Message[];
    selectedModel: ModelOptions;
    setSelectedModel: Dispatch<SetStateAction<ModelOptions>>;
    setMessages: Dispatch<SetStateAction<Record<string, any>[]>>;
    streamMessage: (
        currentThreadId: string | null | undefined,
        params: ChatPageInput,
    ) => Promise<void>;
    // switchSelectedThread: (thread: Thread) => void;
}

// type UserDataContextType = ReturnType<typeof useUser>;
// type PageDataContextType = ReturnType<typeof usePage>;

type ChatPageType = {
    // userData: UserDataContextType;
    // pageData: PageDataContextType;
}
const ChatPageContext = createContext<ChatPageType | undefined>(undefined);

export function useChatPageContext() { 
    const context = useContext(ChatPageContext);
    if (context === undefined) {
        throw new Error(
            "useChatWindowContext must be used within a ChatWindowProvider",
        );
    }
    return context;
}