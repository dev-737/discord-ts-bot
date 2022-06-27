import { client } from "../index";

export = {
    name: 'ready',
    once: true,
    async execute() {
        console.log('Logged in as ' + client.user?.tag + '\nVersion: ' + client.version)
    },
};