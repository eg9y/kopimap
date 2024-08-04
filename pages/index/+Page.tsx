import { clientOnly } from "vike-react/clientOnly";

function Homepage() {
  const ClientOnlyApp = clientOnly(() => import('../../components/app').then(module => module.App ));

  return (
    <>
      <ClientOnlyApp />
    </>
  );
}

export default Homepage;
