import { Node, NodeProperties, Red } from 'node-red';
import {Request, Response, Application} from "express"
import axios from "axios"

export interface ISomaSmartShadeProperties extends NodeProperties {
    port: number;
    host: string;
    protocol: 'http' | 'https';
}

export interface ISomaSmartShadeConfigNode extends Node {
    serverAddress: string;
}

function getBaseUrl(properties: ISomaSmartShadeProperties) {
    return `${properties.protocol}://${properties.host}:${properties.port}`;
}


module.exports = function (module: Red) {
    function SomaSmartShadeConfig(this: ISomaSmartShadeConfigNode, config: ISomaSmartShadeProperties) {
        module.nodes.createNode(this, config);

        this.serverAddress = getBaseUrl(config);
    }

    module.nodes.registerType('soma-smart-shade-config', SomaSmartShadeConfig);

    (module.httpNode as Application).get('/soma-smart-shade-devices', async (req: Request, res: Response) => {
        const baseUrl = getBaseUrl(req.query as any);
        const result = await axios.get(`${baseUrl}/list_devices`);

        res.json(result.data.shades);
    });
};
