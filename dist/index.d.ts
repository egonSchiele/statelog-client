export type JSONEdge = {
    type: "regular";
    to: string;
} | {
    type: "conditional";
    adjacentNodes: readonly string[];
};
export declare class StatelogClient {
    private host;
    private debugMode;
    private traceId;
    private apiKey;
    private projectId;
    constructor(config: {
        host: string;
        apiKey: string;
        projectId: string;
        traceId?: string;
        debugMode?: boolean;
    });
    toJSON(): {
        traceId: string;
        projectId: string;
        host: string;
        debugMode: boolean;
    };
    debug(message: string, data: any): Promise<void>;
    graph({ nodes, edges, startNode, }: {
        nodes: string[];
        edges: Record<string, JSONEdge>;
        startNode?: string;
    }): Promise<void>;
    enterNode({ nodeId, data, }: {
        nodeId: string;
        data: any;
    }): Promise<void>;
    exitNode({ nodeId, data, timeTaken, }: {
        nodeId: string;
        data: any;
        timeTaken?: number;
    }): Promise<void>;
    beforeHook({ nodeId, startData, endData, timeTaken, }: {
        nodeId: string;
        startData: any;
        endData: any;
        timeTaken?: number;
    }): Promise<void>;
    afterHook({ nodeId, startData, endData, timeTaken, }: {
        nodeId: string;
        startData: any;
        endData: any;
        timeTaken?: number;
    }): Promise<void>;
    followEdge({ fromNodeId, toNodeId, isConditionalEdge, data, }: {
        fromNodeId: string;
        toNodeId: string;
        isConditionalEdge: boolean;
        data: any;
    }): Promise<void>;
    promptCompletion({ messages, completion, model, timeTaken, }: {
        messages: any[];
        completion: any;
        model?: string;
        timeTaken?: number;
    }): Promise<void>;
    toolCall({ toolName, args, output, model, timeTaken, }: {
        toolName: string;
        args: any;
        output: any;
        model?: string;
        timeTaken?: number;
    }): Promise<void>;
    post(body: Record<string, any>): Promise<void>;
}
