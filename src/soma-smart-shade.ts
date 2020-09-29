import { Red, Node, NodeProperties } from 'node-red';
import { ISomaSmartShadeConfigNode } from './soma-smart-shade-config';
import axios from "axios";

export interface ISomaSmartShadeProperties extends NodeProperties {
    server?: string;
    blindid?: string;
}

interface ISomaSmartShadeNode extends Node {
    server?: ISomaSmartShadeConfigNode | null;
}

enum NodeAction {
    open = "open",
    close = "close",
    stop = "stop",
    getPosition = "getPosition",
    setPosition = "setPosition",
    getBattery = "getBattery",
}

type BlindPayload = { action: keyof typeof NodeAction, position?: number | string };

module.exports = function (module: Red) {
    function SomaSmartShadeNode(this: ISomaSmartShadeNode, config: ISomaSmartShadeProperties) {
        module.nodes.createNode(this, config);

        this.server = config.server ? module.nodes.getNode(config.server) as ISomaSmartShadeConfigNode : undefined;

        this.on('input', async (msg, send, done) => {
            const payload: BlindPayload = typeof msg.payload === "string" ? {action: msg.payload} : msg.payload;

            if (typeof payload.action != "string" || NodeAction[payload.action] == null) {
                this.warn(`Incorrect msg.payload received: '${JSON.stringify(msg.payload)}'. Payload must be one of ${Object.keys(NodeAction).map(a => `'${a}'`).join(', ')} or an object containing the action: { action: "open"}`);
                return;
            }

            if (this.server == null || config.blindid == null) {
                return;
            }

            let url: string;

            switch (payload.action) {
                case "open":
                    url = `${this.server.serverAddress}/open_shade/${config.blindid}`;
                    break;
                case "close":
                    url = `${this.server.serverAddress}/close_shade/${config.blindid}`;
                    break;
                case "stop":
                    url = `${this.server.serverAddress}/stop_shade/${config.blindid}`;
                    break;
                case "getPosition":
                    url = `${this.server.serverAddress}/get_shade_state/${config.blindid}`;
                    break;
                case "setPosition":
                    if(payload.position == null){
                        this.warn(`Incorrect msg.payload received: '${JSON.stringify(msg.payload)}'. To set position the following object must be sent: {action: "setPosition", position: 30}`);

                        return;
                    }
                    url = `${this.server.serverAddress}/set_shade_position/${config.blindid}/${payload.position}`;
                    break;
                case "getBattery":
                    url = `${this.server.serverAddress}/get_battery_level/${config.blindid}`;
                    break;
                default:
                    handleNever(this, payload.action);
                    return;
            }

            axios.get(url).then(result => {
                msg.payload = result.data;

                send(msg);
            }).catch(err => {
                done(err);
            })

        });

    }

    module.nodes.registerType('soma-smart-shade', SomaSmartShadeNode);
};

function handleNever(node: ISomaSmartShadeNode, action: never) {

    node.warn(`Unknown payload: ${action}`);
}
