import EventListener from './eventlistener';
import asar from 'asar';
import fs from 'fs';
import path from 'path';

import { Modals } from 'ui';
import { Utils } from 'common';
import PluginManager from './pluginmanager';
import Globals from './globals';

export default class {

    static async installPackageEvent(pkg, upload) {
        try {
            const config = JSON.parse(asar.extractFile(pkg.path, 'config.json').toString());
            const { info, main } = config;

            let icon = null;
            if (info.icon && info.icon_type) {
                const extractIcon = asar.extractFile(pkg.path, info.icon);
                icon = `data:${info.icon_type};base64,${Utils.arrayBufferToBase64(extractIcon)}`;
            }
            if (icon) config.iconEncoded = icon;
            const isPlugin = info.type && info.type === 'plugin' || main.endsWith('.js');

            config.path = pkg.path;

            /*
            config.permissions = [
                {
                    HEADER: 'Test Permission Header',
                    BODY: 'Test Permission Body'
                },
                {
                    HEADER: 'Test Permission Header',
                    BODY: 'Test Permission Body'
                },
                {
                    HEADER: 'Test Permission Header',
                    BODY: 'Test Permission Body'
                },
                {
                    HEADER: 'Test Permission Header',
                    BODY: 'Test Permission Body'
                }
            ];
            */
            // Show install modal
            const modalResult = await Modals.installModal(isPlugin ? 'plugin' : 'theme', config).promise;

            if (modalResult === 0) {
                // Upload it instead
            }

            console.log(modalResult);

        } catch (err) {}
    }

    // TODO lots of stuff
    /**
     * Installs or updates defined package
     * @param {Byte[]|String} bytesOrPath byte array of binary or path to local file
     * @param {String} name Package name
     * @param {Boolean} update Does an older version already exist
     */
    static async installPackage(bytesOrPath, name, update = false) {
        const bytes = typeof bytesOrPath === 'string' ? fs.readFileSync(bytesOrPath) : bytesOrPath;
        const outputPath = path.join(Globals.getPath('plugins'), `${name}.bd`);
        fs.writeFileSync(outputPath, bytes);

        if (!update) {
            return PluginManager.preloadPackedContent(`${name}.bd`);
        }

        return PluginManager.reloadContent(PluginManager.getPluginByName(name));
    }

}
