import { clientOnly } from "vike-react/clientOnly";

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  const Layout = clientOnly(() =>
    import("@/components/layout").then((m) => m.Layout)
  );
  return <Layout>{children}</Layout>;
}
