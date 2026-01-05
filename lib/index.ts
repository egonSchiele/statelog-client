import { nanoid } from "nanoid";

export type JSONEdge =
  | { type: "regular"; to: string }
  | { type: "conditional"; adjacentNodes: readonly string[] };

export class StatelogClient {
  private host: string;
  private debugMode: boolean;
  private tid: string;

  constructor({
    host,
    tid,
    debugMode,
  }: {
    host: string;
    tid?: string;
    debugMode?: boolean;
  }) {
    this.host = host;
    this.debugMode = debugMode || false;
    this.tid = tid || nanoid();
    if (this.debugMode)
      console.log(
        `Statelog client initialized with host: ${host} and TID: ${this.tid}`
      );
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
      },
      body: JSON.stringify({
        tid: this.tid,
        data: { ...body, timeStamp: new Date().toISOString() },
      }),
    }).catch((err) => {
      if (this.debugMode) console.error("Failed to send statelog:", err);
    });
  }
}
