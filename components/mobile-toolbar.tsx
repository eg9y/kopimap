import { Link, Toolbar } from "konsta/react";


export default function MobileToolbar() {
  return (
    <Toolbar
      className={`left-0 bottom-0 fixed  w-full`}
    >
      <Link toolbar>Link 1</Link>
      <Link toolbar>Link 2</Link>
      <Link toolbar>Link 3</Link>
    </Toolbar>
  )
}
