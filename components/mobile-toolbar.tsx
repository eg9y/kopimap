import { HomeIcon, UserIcon } from "@heroicons/react/20/solid";
import { Tabbar, TabbarLink } from "konsta/react";


export default function MobileToolbar() {
  return (
    <Tabbar
      className={`left-0 bottom-0 fixed w-full`}
    >
      <TabbarLink
        active={false}
        onClick={() => { }}
        icon={
          <HomeIcon />
        }
        label={'Home'}
      />
      <TabbarLink
        active={false}
        onClick={() => { }}
        icon={
          <UserIcon />
        }
        label={'Login'}
      />
    </Tabbar>
  )
}
