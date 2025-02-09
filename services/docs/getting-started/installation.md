To get started, install both the **backend Docker image** and the **desktop application**.

## Backend Docker image

1. Log in to Docker Hub (skip this step if you’re already logged in):
```console
docker login -u <USER_NAME> -p <PASSWORD>
```
Replace `<USER_NAME>` and `<PASSWORD>` with your Docker Hub credentials.

2. Pull the Docker image:
```console
docker pull khokao/synergetica
```

## Desktop app

Download the installer for your operating system:

<div class="grid cards" markdown>

- [:material-apple: macOS](https://github.com/khokao/synergetica/releases/download/nightly/Synergetica_0.0.0_aarch64.dmg)
- [:material-microsoft-windows: Windows](https://github.com/khokao/synergetica/releases/download/nightly/Synergetica_0.0.0_x64-setup.exe)
- [:material-linux: Linux](https://github.com/khokao/synergetica/releases/download/nightly/Synergetica_0.0.0_amd64.deb)

</div>

You can find all available installers on the <u>[releases page](https://github.com/khokao/synergetica/releases)</u>.

!!! note "Note (macOS Users)"
    After installing Synergetica, run the following command to launch the app:
    ```sh
    xattr -d com.apple.quarantine /Applications/Synergetica.app
    ```

!!! note
    If the Docker engine is running when you open the desktop app, the Docker container will automatically start and the API will launch on port `7007`.

!!! tip
    Check the ::octicons-zap-16: icon at the bottom-right of the app screen to confirm that you’re connected to the backend API.

    - :octicons-zap-16:{ .ok } : Connected to the API
    - :lucide-zap-off:{ .ng } : Not connected to the API
