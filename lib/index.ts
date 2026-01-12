import { nanoid } from "nanoid";

export type JSONEdge =
  | { type: "regular"; to: string }
  | { type: "conditional"; adjacentNodes: readonly string[] };

export class StatelogClient {
  private host: string;
  private debugMode: boolean;
  private traceId: string;
  private apiKey: string;
  private projectId: string;

  constructor(config: {
    host: string;
    apiKey: string;
    projectId: string;
    traceId?: string;
    debugMode?: boolean;
  }) {
    const { host, apiKey, projectId, traceId, debugMode } = config;
    this.host = host;
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.debugMode = debugMode || false;
    this.traceId = traceId || nanoid();
    if (this.debugMode) {
      console.log(
        `Statelog client initialized with host: ${host} and traceId: ${this.traceId}`,
        { config }
      );
    }

    if (!this.apiKey) {
      throw new Error("API key is required for StatelogClient");
    }
  }

  debug(message: string, data: any): void {
    this.post({
      type: "debug",
      message: message,
      data,
    });
  }

  graph({
    nodes,
    edges,
    startNode,
  }: {
    nodes: string[];
    edges: Record<string, JSONEdge>;
    startNode?: string;
  }): void {
    this.post({
      type: "graph",
      nodes,
      edges,
      startNode,
    });
  }

  enterNode({ nodeId, data }: { nodeId: string; data: any }): void {
    this.post({
      type: "enterNode",
      nodeId,
      data,
    });
  }

  exitNode({
    nodeId,
    data,
    timeTaken,
  }: {
    nodeId: string;
    data: any;
    timeTaken?: number;
  }): void {
    this.post({
      type: "exitNode",
      nodeId,
      data,
      timeTaken,
    });
  }

  beforeHook({
    nodeId,
    startData,
    endData,
    timeTaken,
  }: {
    nodeId: string;
    startData: any;
    endData: any;
    timeTaken?: number;
  }): void {
    this.post({
      type: "beforeHook",
      nodeId,
      startData,
      endData,
      timeTaken,
    });
  }

  afterHook({
    nodeId,
    startData,
    endData,
    timeTaken,
  }: {
    nodeId: string;
    startData: any;
    endData: any;
    timeTaken?: number;
  }): void {
    this.post({
      type: "afterHook",
      nodeId,
      startData,
      endData,
      timeTaken,
    });
  }

  followEdge({
    fromNodeId,
    toNodeId,
    isConditionalEdge,
    data,
  }: {
    fromNodeId: string;
    toNodeId: string;
    isConditionalEdge: boolean;
    data: any;
  }): void {
    this.post({
      type: "followEdge",
      edgeId: `${fromNodeId}->${toNodeId}`,
      fromNodeId,
      toNodeId,
      isConditionalEdge,
      data,
    });
  }

  promptCompletion({
    messages,
    completion,
    model,
    timeTaken,
  }: {
    messages: any[];
    completion: any;
    model?: string;
    timeTaken?: number;
  }): void {
    this.post({
      type: "promptCompletion",
      messages,
      completion,
      model,
      timeTaken,
    });
  }

  toolCall({
    toolName,
    args,
    output,
    model,
    timeTaken,
  }: {
    toolName: string;
    args: any;
    output: any;
    model?: string;
    timeTaken?: number;
  }): void {
    this.post({
      type: "toolCall",
      toolName,
      args,
      output,
      model,
      timeTaken,
    });
  }

  post(body: Record<string, any>): void {
    const fullUrl = new URL("/api/logs", this.host);
    const url = fullUrl.toString();

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        trace_id: this.traceId,
        project_id: this.projectId,
        data: { ...body, timeStamp: new Date().toISOString() },
      }),
    }).catch((err) => {
      if (this.debugMode) console.error("Failed to send statelog:", err);
    });
  }
}
