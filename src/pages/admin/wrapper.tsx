import type { DiscordUser, STATUS } from "@/pages/login/discord/callback";
import { useImmerReducer } from "use-immer";

import { UserCard } from "@/pages/user/user-card";

import { EditForm } from "@/pages/admin/form";
import { generateId } from "lucia";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRightIcon } from "lucide-react";

export type State = DiscordUser;

export type Action =
  | {
      type: "UPDATE_DESCRIPTION";
      value: string;
    }
  | {
      type: "UPDATE_GLOBAL_NAME";
      value: string;
    }
  | {
      type: "ADD_EMPTY_LINK";
    }
  | {
      type: "UPDATE_LINKS";
      value: DiscordUser["links"];
    }
  | {
      type: "UPDATE_STATUS";
      value: STATUS;
    };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "UPDATE_DESCRIPTION": {
      state.description = action.value;
      return state;
    }
    case "UPDATE_GLOBAL_NAME": {
      state.global_name = action.value;
      return state;
    }
    case "ADD_EMPTY_LINK": {
      if (state.links.length === 10) return state;

      state.links.unshift({
        id: generateId(5),
        name: "Label",
        link: "",
      });

      return state;
    }
    case "UPDATE_STATUS": {
      state.status = action.value;
      return state;
    }
    case "UPDATE_LINKS": {
      state.links = action.value.map((item) => ({ ...item }));
      return state;
    }
    default: {
      // @ts-expect-error
      throw new Error(`${action.type} is not supported`);
    }
  }
  return state;
}

export function Wrapper({ user }: { user: DiscordUser }) {
  const [state, dispatch] = useImmerReducer(reducer, user as State);
  return (
    <div className="flex-1 flex ">
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold md:text-2xl text-[--text-normal]">
            Edit
          </h2>
          <a
            target="_blank"
            href={`/user/${user.username}`}
            className={cn(
              "flex gap-2 items-center",
              buttonVariants({ variant: "discord_muted", size: "xs" })
            )}
          >
            Preview <ArrowUpRightIcon className="h-4 w-4" />
          </a>
        </div>
        <EditForm state={state} dispatch={dispatch} />
      </div>
      <div className="flex flex-col flex-1">
        <UserCard user={state} />
      </div>
    </div>
  );
}
