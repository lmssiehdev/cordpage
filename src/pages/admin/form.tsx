import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { minDelay } from "@/lib/utils";
import type { Action, State } from "@/pages/admin/wrapper";
import type { STATUS } from "@/pages/login/discord/callback";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateId } from "lucia";
import { LoaderIcon, PlusIcon, XIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

export const getDiscordAvatar = (id: string, avatar: string, size = 160) => {
  if (avatar === "") {
    return "https://cdn.discordapp.com/avatars/155149108183695360/b4fdfc64edff74c37e1574d34fad66c2.webp?size=160";
  }
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=160`;
};

const DESCRIPTION_MAX_LENGTH = 450;

const STATUS_MAP = {
  ACTIVE: "Active",
  IDLE: "Idle",
  DO_NO_DISTURB: "Do Not Disturb",
  INACTIVE: "Inactive",
};

const formSchema = z.object({
  global_name: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  description: z.string().max(DESCRIPTION_MAX_LENGTH, {
    message: `Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters`,
  }),
  status: z.string({
    required_error: "Please select a status to display.",
  }),
  links: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, {
        message: "Please provide a label.",
      }),
      link: z
        .string({
          required_error: "Please select a status to display.",
        })
        .url({
          message: "Please enter a valid url",
        }),
    })
  ),
});

export function EditForm({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      global_name: state.global_name!,
      description: state.description!,
      status: state.status!,
      links: state.links!,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  useEffect(() => {
    console.log("render");
  }, []);

  form.watch("links");

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === "status") {
        dispatch({ type: "UPDATE_STATUS", value: value.status! as STATUS });
        return;
      }

      if (name === "global_name") {
        dispatch({
          type: "UPDATE_GLOBAL_NAME",
          value: value.global_name!,
        });
        return;
      }

      if (name === "description") {
        dispatch({
          type: "UPDATE_DESCRIPTION",
          value: value.description!,
        });
        return;
      }

      if (name?.startsWith("links")) {
        dispatch({
          type: "UPDATE_LINKS",
          // @ts-expect-error
          value: value.links!,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    await minDelay(
      fetch("/api/update-data", {
        method: "POST",
        body: JSON.stringify(state),
      })
        .then((res) => res.json())
        .then(console.log),
      700
    );

    setIsLoading(false);
  }

  return (
    <div className="flex-1 flex flex-col">
      <Form {...form}>
        <form
          className="flex-1 flex flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="global_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold text-[--header-secondary] mb-2">
                  DISPLAY NAME
                </FormLabel>
                <FormControl>
                  <Input
                    variant="discord"
                    placeholder="dispay name"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="text-xs font-bold text-[--header-secondary]">
                  ABOUT ME
                </FormLabel>
                <FormControl>
                  <Textarea
                    variant="discord"
                    {...field}
                    // maxLength={DESCRIPTION_MAX_LENGTH}
                  />
                </FormControl>
                {/* <FormDescription>
                  You can use markdown and links if you'd like.
                </FormDescription> */}
                <FormMessage className="text-red-300"></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="text-xs font-bold text-[--header-secondary] ">
                  STATUS
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[--input-background] text-white border-none">
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[--input-background] text-white  border-none">
                    {Object.keys(STATUS_MAP).map((key) => {
                      const statusDisplay =
                        STATUS_MAP[key as keyof typeof STATUS_MAP];
                      return (
                        <SelectItem
                          className="capitalize border-current
                          focus:bg-[--background-modifier-hover]
                          focus:text-white"
                          value={key}
                          key={key}
                        >
                          {statusDisplay}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {/* <FormDescription>
                  You can manage email addresses in your
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <h3 className="text-xs font-bold text-[--header-secondary] my-3">
              LINK
            </h3>
            {state.links.length != 10 && (
              <div>
                <button
                  onClick={() =>
                    append({
                      id: generateId(12),
                      name: "Label",
                      link: "https://",
                    })
                  }
                  className="flex items-center justify-center gap-2 text-[--text-primary] bg-[--background-tertiary] rounded-sm text-xs py-1 px-2 w-full font-bold"
                >
                  <PlusIcon className="size-4" />
                  Add Link
                </button>
              </div>
            )}

            {fields.map((gfield, index) => (
              <div key={gfield.id} className="flex gap-2  my-4">
                <FormField
                  control={form.control}
                  name={`links.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-[--header-secondary]">
                        LABEL
                      </FormLabel>
                      <FormDescription />
                      <FormControl>
                        <Input variant="discord" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`links.${index}.link`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs text-[--header-secondary]">
                        URL
                      </FormLabel>
                      <FormDescription />
                      <FormControl>
                        <Input variant="discord" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <div className="invisible">LABEL</div>
                  <button
                    onClick={() => {
                      remove(index);
                    }}
                    className=" hover:text-[--info-danger-foreground]  text-[--interactive-normal] bg-[--primary-630] rounded-full flex justify-center items-center size-9"
                  >
                    <XIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="mt-auto text-[--white-500] bg-[--button-positive-background] hover:bg-[--button-positive-background-hover] rounded-sm w-full px-4 font-bold text-xs"
            disabled={isLoading}
            type="submit"
          >
            {isLoading && (
              <LoaderIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
            )}
            Publish
          </Button>
        </form>
      </Form>
      {/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
    </div>
  );
}
