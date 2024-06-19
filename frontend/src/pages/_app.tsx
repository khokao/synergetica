import type { AppProps } from "next/app";
import { ResponseProvider } from "../context/GeneratorResponseContext";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ResponseProvider>
      <Component {...pageProps} />
    </ResponseProvider>
  );
};

export default App;
