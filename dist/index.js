import { nanoid } from "nanoid";
export class StatelogClient {
    constructor({ host, apiKey, projectId, tid, debugMode, }) {
        this.host = host;
        this.apiKey = apiKey;
        this.projectId = projectId;
        this.debugMode = debugMode || false;
        this.tid = tid || nanoid();
        if (this.debugMode) {
            console.log(`Statelog client initialized with host: ${host} and TID: ${this.tid}`);
        }
        if (!this.apiKey) {
            throw new Error("API key is required for StatelogClient");
        }
    }
    debug(message, data) {
        this.post({
            type: "debug",
            message: message,
            data,
        });
    }
    graph({ nodes, edges, startNode, }) {
        this.post({
            type: "graph",
            nodes,
            edges,
            startNode,
        });
    }
    enterNode({ nodeId, data }) {
        this.post({
            type: "enterNode",
            nodeId,
            data,
        });
    }
    exitNode({ nodeId, data, timeTaken, }) {
        this.post({
            type: "exitNode",
            nodeId,
            data,
            timeTaken,
        });
    }
    beforeHook({ nodeId, startData, endData, timeTaken, }) {
        this.post({
            type: "beforeHook",
            nodeId,
            startData,
            endData,
            timeTaken,
        });
    }
    afterHook({ nodeId, startData, endData, timeTaken, }) {
        this.post({
            type: "afterHook",
            nodeId,
            startData,
            endData,
            timeTaken,
        });
    }
    followEdge({ fromNodeId, toNodeId, isConditionalEdge, data, }) {
        this.post({
            type: "followEdge",
            edgeId: `${fromNodeId}->${toNodeId}`,
            fromNodeId,
            toNodeId,
            isConditionalEdge,
            data,
        });
    }
    promptCompletion({ messages, completion, model, timeTaken, }) {
        this.post({
            type: "promptCompletion",
            messages,
            completion,
            model,
            timeTaken,
        });
    }
    toolCall({ toolName, args, output, model, timeTaken, }) {
        this.post({
            type: "toolCall",
            toolName,
            args,
            output,
            model,
            timeTaken,
        });
    }
    post(body) {
        const fullUrl = new URL("/api/logs", this.host);
        const url = fullUrl.toString();
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                tid: this.tid,
                project_id: this.projectId,
                data: Object.assign(Object.assign({}, body), { timeStamp: new Date().toISOString() }),
            }),
        }).catch((err) => {
            if (this.debugMode)
                console.error("Failed to send statelog:", err);
        });
    }
}
