const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

// White-listed channels.
const ipc = {
  'render': {
    // From render to main.
    'send': [
      'openDetailsWindow',
      'login:failed'
    ],
    // From main to render.
    'receive': [
      'pushDetails'
    ],
    // From render to main and back again.
    'sendReceive': [
      'login',
      'get:products'
    ],
  }
};

contextBridge.exposeInMainWorld('testApi', {
  // Invoke Methods
  testInvoke: (args) => ipcRenderer.invoke('test-invoke', args),
  // Send Methods
  testSend: (args) => ipcRenderer.send('test-send', args),
  // Receive Methods
  testReceive: (callback) => ipcRenderer.on('test-receive', (event, data) => { callback(data) })
});

contextBridge.exposeInMainWorld('electron', {
  homeDir: () => os.homedir(),
  osVersion: () => os.version(),
  osArch: () => os.arch(),
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
});

contextBridge.exposeInMainWorld( 'api', {
  // send: ( channel, data ) => ipcRenderer.invoke( channel, data ),
  // handle: ( channel, callable, event, data ) => ipcRenderer.on( channel, callable( event, data ) ),

  // From render to main.
  send: (channel, args) => {
    let validChannels = ipc.render.send;
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, args);
    }
  },

  // From main to render.
  receive: (channel, listener) => {
    let validChannels = ipc.render.receive;
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`.
      ipcRenderer.on(channel, (event, ...args) => listener(...args));
    }
  },

  // From render to main and back again.
  invoke: (channel, args) => {
    let validChannels = ipc.render.sendReceive;
    if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, args);
    }
  }

});

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile')
});