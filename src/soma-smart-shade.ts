import { Red, Node, NodeProperties } from 'node-red';
import { ISomaSmartShadeConfigNode } from './soma-smart-shade-config';

export interface ISomaSmartShadeProperties extends NodeProperties {
    server: string;
}

interface ISomaSmartShadeNode extends Node {
    server: ISomaSmartShadeConfigNode | null;
}

module.exports = function (module: Red) {
    function SomaSmartShadeNode(this: ISomaSmartShadeNode, config: ISomaSmartShadeProperties) {
        module.nodes.createNode(this, config);

        this.server = module.nodes.getNode(config.server) as ISomaSmartShadeConfigNode;

    }

    module.nodes.registerType('soma-smart-shade', SomaSmartShadeNode);
};
