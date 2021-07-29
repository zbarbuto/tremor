const {
  app,
  BrowserWindow,
  Tray,
  globalShortcut,
  screen,
  Menu,
  nativeImage,
} = require('electron');
const { join } = require('path');

let hasWin = false;

function createWindow() {
  const electronScreen = screen;
  const { x, y } = screen.getCursorScreenPoint();
  // Find the display where the mouse cursor will be
  // const currentDisplay = screen.getDisplayNearestPoint({ x, y });

  const displays = electronScreen.getAllDisplays();
  const currentDisplay = screen.getDisplayNearestPoint({ x, y });
  const size = currentDisplay.workAreaSize;

  let win = new BrowserWindow({
    x: currentDisplay.bounds.x,
    y: 0,
    frame: false,
    width: size.width,
    height: size.height / 3,
  });

  win.loadURL('https://www.google.com');

  // Emitted when the window is closed.
  win.on('closed', (e) => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // win = null;
    hasWin = false;
    win = null;

    // Don't exit electron
    e.preventDefault();
  });

  return win;
}

app.whenReady().then(() => {
  let win;
  const ret = globalShortcut.register('Alt+Ctrl+`', () => {
    if (!hasWin) {
      win = createWindow();
      hasWin = true;
    } else {
      win.close();
    }
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Exit',
      enabled: true,
      click: () => {
        app.quit();
      },
    },
  ]);

  // No need for tray icon on mac since we have the tray icon
  app.dock.hide();

  tray = new Tray(
    nativeImage
      .createFromPath(
        join(
          __dirname,
          'icon',
          process.platform === 'win32' ? 'icon.ico' : 'icon.png'
        )
      )
      .resize(
        process.platform === 'darwin'
          ? { width: 16, height: 16 }
          : { width: 128, height: 128 }
      )
  );
  tray.setToolTip('Tremor');
  tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {
  // do nothing - otherwise electron exits
});
