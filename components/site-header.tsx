import { SidebarTrigger } from "@/components/ui/sidebar"
import { Typography } from "./ui/Typography"
import UserSVGComponent from "@/public/icons/user"

export function SiteHeader({user}: {user: any}) {
  return (
    <header className="flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6 py-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-10">
          <Typography as="h3" color="ghost_foreground" size="sm" weight="medium" className="capitalize">
          {user?.userDetails?.firstName}
        </Typography>
        <UserSVGComponent/>
        </div>
      </div>
    </header>
  )
}
