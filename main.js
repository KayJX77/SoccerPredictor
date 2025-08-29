const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Keep a global reference of the window object
let mainWindow;
let serverProcess;

function createWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'assets/icon.png'), // Optional: Add app icon
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        titleBarStyle: 'default',
        show: false // Don't show until ready
    });

    // Start the Express server
    serverProcess = spawn('node', ['server.js'], {
        cwd: __dirname,
        stdio: 'pipe'
    });

    // Wait a moment for server to start, then load the app
    setTimeout(() => {
        mainWindow.loadURL('http://localhost:5000');
        mainWindow.show();
    }, 2000);

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Create application menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Refresh',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.reload();
                        }
                    }
                },
                {
                    label: 'Developer Tools',
                    accelerator: 'F12',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.toggleDevTools();
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Zoom In',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => {
                        if (mainWindow) {
                            const currentZoom = mainWindow.webContents.getZoomLevel();
                            mainWindow.webContents.setZoomLevel(currentZoom + 1);
                        }
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => {
                        if (mainWindow) {
                            const currentZoom = mainWindow.webContents.getZoomLevel();
                            mainWindow.webContents.setZoomLevel(currentZoom - 1);
                        }
                    }
                },
                {
                    label: 'Reset Zoom',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.setZoomLevel(0);
                        }
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About Synapse Soccer Prophet',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About',
                            message: 'Synapse Soccer Prophet',
                            detail: 'Football Prediction & Analysis Suite\nVersion 1.0.0'
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
    // Kill the server process
    if (serverProcess) {
        serverProcess.kill();
    }
    
    // On macOS, keep app running even when all windows are closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Prevent navigation to external URLs
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
    });
    
    contents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        if (parsedUrl.origin !== 'http://localhost:5000') {
            event.preventDefault();
        }
    });
});