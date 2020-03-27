import { WorkspaceConfiguration } from 'vscode';

import * as ua from 'universal-analytics';
import * as nmi from 'node-machine-id';

export const Analytics = (config?: WorkspaceConfiguration) => {
    const UA_ID = 'UA-106099545-2';
    const cfgEnableAnalytic = 'enableAnalytic';

    let enable = config ? config.get<boolean>(cfgEnableAnalytic) : false;
    let visitor = ua(UA_ID, nmi.machineIdSync(true), { https: true });

    return {
        updateConfig(config: WorkspaceConfiguration) {
            enable = config.get<boolean>(cfgEnableAnalytic);
        },
        send(label, value) {
            if (enable) {
                visitor.event(label, value).send();
            }
        }
    }
}