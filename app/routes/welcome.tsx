
import { MetaFunction } from "remix"
import SiteLayout from "~/components/SiteLayout";
import StarterKit from "~/components/StarterKit";

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
    return {
      title: "Remix Starter Kit - Welcome",
      description: "Welcome to Remix Starter Kit"
    };
};


export default function Welcome() {
  return (
      <SiteLayout>
        <div className="min-h-screen flex flex-col justify-center items-center relative">
            <main className="">
                <StarterKit/>
                <p>You're signed-up now. Please check your email for the activation email</p>
            </main>
            <aside className="text-center mt-4">
                {/* Anything? */}
            </aside>
        </div>
    </SiteLayout>
  );
}
