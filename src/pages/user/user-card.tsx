import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getDiscordAvatar } from "@/pages/admin/form";
import type { DiscordUser } from "@/pages/login/discord/callback";
import Tilt from "react-parallax-tilt";
import { Fragment } from "react/jsx-runtime";

export function UserCardWithTilt({
  user,
  className,
}: {
  user: DiscordUser;
  className?: string;
}) {
  return (
    <Tilt className="parallax-effect">
      <UserCard user={user} className={className} />
    </Tilt>
  );
}

export function UserCard({
  user,
  className,
}: {
  user: DiscordUser;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-full w-full pb-2 overflow-hidden shaodw-lg bg-[--background-secondary-alt] flex-1",
        className
      )}
    >
      <div>
        <div
          className="h-40 z-20"
          style={{
            background: user.banner_color ?? "#4b8b8b",
          }}
        ></div>
        <div className="relative w-fit">
          <div className="overflow-hidden flex justify-center items-center size-32 rounded-full -mt-[68px] ml-5 before:top-0 before:left-0  before:absolute before:bg-[--background-secondary-alt] before:size-[110%] relative">
            <img
              className="rounded-full size-[90%] z-10"
              src={getDiscordAvatar(user?.discord_id, user?.avatar ?? "")}
            />
          </div>
          <Status />
        </div>
      </div>

      <div className="m-4 rounded-lg overflow-hidden shadow-lg bg-[--background-floating]">
        <div className="bg-discord-floating text-white p-3">
          <div className=" font-semibold text-xl">{user.global_name}</div>
          <div className=" font-bold"> {user.username} </div>
          <Separator className=" bg-[--profile-body-divider-color] my-2" />
          <div>
            <div
              className="text-xs font-bold my-2
            "
            >
              ABOUT ME
            </div>
            {user.description}
          </div>
          {user?.links?.length > 0 && (
            <div>
              <div
                className="text-xs font-bold my-2
              "
              >
                LINKS
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {user.links.map(({ name, link }) => (
                  <Fragment key={`${name}+${link}`}>
                    <Link href={link}>{name}</Link>
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Status() {
  return (
    <div className="size-8 bg-[--background-secondary-alt] flex items-center justify-center rounded-full absolute bottom-0 right-2 z-20">
      <div className="size-[65%] rounded-full bg-green-600"></div>
    </div>
  );
}
