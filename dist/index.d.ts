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
    debug(message: string, data: any): void;
    graph({ nodes, edges, startNode, }: {
        nodes: string[];
        edges: Record<string, JSONEdge>;
        startNode?: string;
    }): void;
    enterNode({ nodeId, data }: {
        nodeId: string;
        data: any;
    }): void;
    exitNode({ nodeId, data, timeTaken, }: {
        nodeId: string;
        data: any;
        timeTaken?: number;
    }): void;
    beforeHook({ nodeId, startData, endData, timeTaken, }: {
        nodeId: string;
        startData: any;
        endData: any;
        timeTaken?: number;
    }): void;
    afterHook({ nodeId, startData, endData, timeTaken, }: {
        nodeId: string;
        startData: any;
        endData: any;
        timeTaken?: number;
    }): void;
    followEdge({ fromNodeId, toNodeId, isConditionalEdge, data, }: {
        fromNodeId: string;
        toNodeId: string;
        isConditionalEdge: boolean;
        data: any;
    }): void;
    promptCompletion({ messages, completion, model, timeTaken, }: {
        messages: any[];
        completion: any;
        model?: string;
        timeTaken?: number;
    }): void;
    toolCall({ toolName, args, output, model, timeTaken, }: {
        toolName: string;
        args: any;
        output: any;
        model?: string;
        timeTaken?: number;
    }): void;
    post(body: Record<string, any>): void;
}
