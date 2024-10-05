import "tailwindcss/tailwind.css";
import "@xyflow/react/dist/style.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default App;
