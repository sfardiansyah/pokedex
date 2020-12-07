import "../styles/globals.css";

interface AppParams {
  Component: React.FC;
  pageProps: object;
}

const MyApp = ({ Component, pageProps }: AppParams) => (
  <Component {...pageProps} />
);

export default MyApp;
