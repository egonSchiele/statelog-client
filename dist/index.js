var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { nanoid } from "nanoid";
export class StatelogClient {
    constructor(config) {
        const { host, apiKey, projectId, traceId, debugMode } = config;
        this.host = host;
        this.apiKey = apiKey;
        this.projectId = projectId;
        this.debugMode = debugMode || false;
        this.traceId = traceId || nanoid();
        if (this.debugMode) {
            console.log(`Statelog client initialized with host: ${host} and traceId: ${this.traceId}`, { config });
        }
        if (!this.apiKey) {
            throw new Error("API key is required for StatelogClient");
        }
    }
    toJSON() {
        return {
            traceId: this.traceId,
            projectId: this.projectId,
            host: this.host,
            debugMode: this.debugMode,
        };
    }
    debug(message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.post({
                type: "debug",
                message: message,
                data,
            });
        });
    }
    graph(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nodes, edges, startNode, }) {
            yield this.post({
                type: "graph",
                nodes,
                edges,
                startNode,
            });
        });
    }
    enterNode(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nodeId, data, }) {
            yield this.post({
                type: "enterNode",
                nodeId,
                data,
            });
        });
    }
    exitNode(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nodeId, data, timeTaken, }) {
            yield this.post({
                type: "exitNode",
                nodeId,
                data,
                timeTaken,
            });
        });
    }
    beforeHook(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nodeId, startData, endData, timeTaken, }) {
            yield this.post({
                type: "beforeHook",
                nodeId,
                startData,
                endData,
                timeTaken,
            });
        });
    }
    afterHook(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nodeId, startData, endData, timeTaken, }) {
            yield this.post({
                type: "afterHook",
                nodeId,
                startData,
                endData,
                timeTaken,
            });
        });
    }
    followEdge(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fromNodeId, toNodeId, isConditionalEdge, data, }) {
            yield this.post({
                type: "followEdge",
                edgeId: `${fromNodeId}->${toNodeId}`,
                fromNodeId,
                toNodeId,
                isConditionalEdge,
                data,
            });
        });
    }
    promptCompletion(_a) {
        return __awaiter(this, arguments, void 0, function* ({ messages, completion, model, timeTaken, tools, responseFormat, }) {
            yield this.post({
                type: "promptCompletion",
                messages,
                completion,
                model,
                timeTaken,
                tools,
                responseFormat,
            });
        });
    }
    toolCall(_a) {
        return __awaiter(this, arguments, void 0, function* ({ toolName, args, output, model, timeTaken, }) {
            yield this.post({
                type: "toolCall",
                toolName,
                args,
                output,
                model,
                timeTaken,
            });
        });
    }
    post(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const postBody = JSON.stringify({
                trace_id: this.traceId,
                project_id: this.projectId,
                data: Object.assign(Object.assign({}, body), { timestamp: new Date().toISOString() }),
            });
            if (this.host.toLowerCase() === "stdout") {
                console.log(postBody);
                return;
            }
            const fullUrl = new URL("/api/logs", this.host);
            const url = fullUrl.toString();
            yield fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: postBody,
            }).catch((err) => {
                if (this.debugMode)
                    console.error("Failed to send statelog:", err);
            });
        });
    }
}
