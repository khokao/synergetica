<a id="readme-top"></a>

# Desktop

[![Biome](https://github.com/khokao/gene-circuit-ide/actions/workflows/node-biome-check.yml/badge.svg)](https://github.com/khokao/gene-circuit-ide/actions/workflows/node-biome-check.yml)
[![Vitest](https://github.com/khokao/gene-circuit-ide/actions/workflows/node-vitest.yml/badge.svg)](https://github.com/khokao/gene-circuit-ide/actions/workflows/node-vitest.yml)
[![Rustfmt](https://github.com/khokao/gene-circuit-ide/actions/workflows/rust-rustfmt.yml/badge.svg)](https://github.com/khokao/gene-circuit-ide/actions/workflows/rust-rustfmt.yml)

[![Release](https://github.com/khokao/gene-circuit-ide/actions/workflows/node-tauri-release.yml/badge.svg)](https://github.com/khokao/gene-circuit-ide/actions/workflows/node-tauri-release.yml)



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#1-about-this-directory">About This Directory</a>
      <ul>
        <li><a href="#11-built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#2-getting-started">Getting Started</a>
      <ul>
        <li><a href="#21-prerequisites">Prerequisites</a></li>
        <li><a href="#22-installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#3-usage">Usage</a>
      <ul>
        <li><a href="#31-running-the-desktop-application">Running the Desktop Application</a></li>
      </ul>
    </li>
    <li>
      <a href="#4-developer-guide">Developer Guide</a>
      <ul>
        <li><a href="#41-code-quality--testing">Code Quality & Testing</a></li>
        <li><a href="#42-desktop-application-release--distribution">Desktop Application Release & Distribution</a></li>
      </ul>
    </li>
  </ol>
</details>



## 1. About This Directory

This directory includes code for the frontend implementation using Next.js and for packaging the application as a desktop app using Tauri.

- [**`src`**](src) contains the frontend implementation using Next.js
- [**`src-tauri`**](src-tauri) contains the code for packaging the application as a desktop app using Tauri

### 1.1. Built With
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Next.js][Next.js]][Next-url]
* [![React.js][React.js]][React-url]
* [![shadcn/ui][shadcn/ui]][shadcn/ui-url]
* [![Rust][Rust]][Rust-url]
* [![Tauri][Tauri]][Tauri-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## 2. Getting Started

### 2.1. Prerequisites

* npm (Node.js)

  Please install it from the [Node.js website](https://nodejs.org/) or another appropriate source.

* cargo (Rust)

  Please follow the official [Rust installation guide](https://www.rust-lang.org/tools/install) to install Rust and Cargo.

### 2.2. Installation

1. Install the required Node.js packages with the following command
   ```sh
   npm install
   ```
2. Optional: If you want to use the simulation and generation APIs, please pull the Docker image
   ```sh
   docker pull khokao/synergetica:latest
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## 3. Usage

### 3.1. Running the Desktop Application

When the application starts, a Docker container is automatically launched, and the API server runs on port 7007. Please make sure Docker Engine is running and that the Docker image has been pulled.

You can also start the API by running the Docker container manually or by starting the FastAPI application yourself. For more details, see the [`../services`](../services) directory.

**Development Mode**

```sh
npm run dev
```

**Production Mode**

```sh
npm run build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## 4. Developer Guide

### 4.1. Code Quality & Testing

We use Biome for linting and formatting, and Vitest for testing. These checks run automatically on GitHub Actions.

**Lint & Format (Biome)**

```sh
uv run check
```

**Test (Vitest)**

```sh
uv run test
```

**Format (Rustfmt)**

Rust code is formatted using Rustfmt, which is also handled automatically by GitHub Actions.

Please run the following command in the [src-tauri](src-tauri) directory:

```sh
cargo fmt
```

### 4.2. Desktop Application Release & Distribution

GitHub Actions automatically builds and creates releases for the desktop application.

* **Nightly Release**:

  Triggered whenever commits are pushed to the `main` branch. This release is ideal if you want to check the latest features and improvements.

* **Stable Release**:

  Triggered when a new tag is created. This release is intended for general users.

The build artifacts for macOS and Windows are generated automatically and can be downloaded from the [GitHub Releases](https://github.com/khokao/gene-circuit-ide/releases) page. Each platform has its own binaries or installers, so make sure to pick the right one for your environment.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff
[TypeScript-url]: https://www.typescriptlang.org/
[Rust]: https://img.shields.io/badge/Rust-%23000000.svg?e&logo=rust&logoColor=white
[Rust-url]: https://www.rust-lang.org/
[Next.js]: https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB
[React-url]: https://reactjs.org/
[shadcn/ui]: https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff
[shadcn/ui-url]: https://ui.shadcn.com/
[Tauri]: https://img.shields.io/badge/Tauri-24C8D8?logo=tauri&logoColor=fff
[Tauri-url]: https://v2.tauri.app/
[GitHub-Actions]: https://img.shields.io/badge/GitHub_Actions-2088FF?logo=github-actions&logoColor=white
[GitHub-Actions-url]: https://github.com/features/actions/
