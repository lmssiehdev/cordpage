import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    await fetch("/api/logout", {
      method: "post",
      body: new FormData(formElement),
    });
    // return;
    window.location.href = "/ ";
  }
  return (
    <form onSubmit={onSubmit}>
      <button
        type="submit"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "flex items-center gap-2"
        )}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}
