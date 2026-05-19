import { Button } from "../ui/Button";

export default function Forbidden() {
  return (
    <div className="bg-mainBgLight flex h-screen w-full items-center justify-center px-12">
      <div className="flex flex-col items-center rounded-xl bg-white py-8">
        <img className="w-40" src="/logo.png" />

        <p className="text-main-navy-blue 500:text-2xl mt-4 text-xl">
          Access Denied
        </p>
        <p className="500:mx-16 800:mx-24 text-main-navy-blue/70 500:text-base 500:mt-4 mx-8 mt-2 text-center text-sm">
          You don’t have permission to view this page.
        </p>
        <Button
          className="mt-6 flex items-center justify-center"
          intent="login"
          size="medium"
        >
          Go back
        </Button>
      </div>
    </div>
  );
}
