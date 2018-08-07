'use strict';

function exitHook(exitFn) {
    // https://nodejs.org/api/process.html#process_signal_events
    [
        'exit',
        'SIGINT',
        'SIGTERM',
        'SIGHUP',
        'SIGBREAK',
        'SIGQUIT',
        'SIGUSR1',
        'SIGUSR2',
    ].forEach((event) => {
        process.on(event, () => {
            exitFn();
        });
    });
}

module.exports = exitHook;
