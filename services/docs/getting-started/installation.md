Synergetica requires a **backend Docker image** and a **desktop application**.

## Backend Docker image

1. Login to Docker Hub (skip if already logged in):
```console
docker login -u <USER_NAME> -p <PASSWORD>
```

2. Pull the Docker image:
```console
docker pull khokao/Synergetica
```


## Desktop app

Download the installer for your operating system:

<div class="grid cards" markdown>

- [:material-apple: macOS](https://github.com/khokao/synergetica/releases/download/nightly/Synergetica_0.0.0_aarch64.dmg)
- [:material-microsoft-windows: Windows](https://github.com/khokao/synergetica/releases/download/nightly/Synergetica_0.0.0_x64-setup.exe)
- [:material-linux: Linux](https://github.com/khokao/synergetica/releases/download/nightly/Synergetica_0.0.0_amd64.deb)

</div>


!!! note "Note (macOS Users)"
    After installing Synergetica, run the following command to open the app:
    ```sh
    xattr -d com.apple.quarantine /Applications/Synergetica.app
    ```

!!! tip
    Check the :octicons-zap-16: icon at the bottom-right of the app screen to confirm whether you’re connected to the backend API.

    - :octicons-zap-16:{ .zap-on } : Connected to the API
    - :octicons-zap-16:{ .zap-off } : Not connected to the API
