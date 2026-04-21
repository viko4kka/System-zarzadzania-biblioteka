import { GoMail } from "react-icons/go";
import { SlLock } from "react-icons/sl";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../../ui/Button";

type LoginFormType = {
  email: string;
  password: string;
};

interface LoginFormProps {
  onSwitch: () => void;
}

export default function LoginForm({ onSwitch }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const onSubmit: SubmitHandler<LoginFormType> = (data) => console.log(data);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="500:text-2xl text-main-navy-blue 800:col-span-2 mb-6 px-8 text-center text-xl">
        Welcome back in our library!
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="500:mt-6 500:px-10 800:px-6 800:gap-y-0.5 my-4 flex w-full flex-col gap-y-1 px-6"
      >
        <div className="flex flex-col gap-y-1">
          <div
            className={`group flex items-center gap-x-1.5 rounded-xl border p-2 transition-all duration-300 ${
              errors.email
                ? "border-error"
                : "border-border-light focus-within:border-main-blue"
            }`}
          >
            <span
              className={`500:text-sm text-xs transition-colors duration-300 ${
                errors.email
                  ? "text-error"
                  : "text-text-form group-focus-within:text-main-blue"
              }`}
            >
              <GoMail />
            </span>
            <input
              {...register("email", { required: true })}
              type="text"
              className="text-text-form 500:text-sm w-full bg-transparent text-xs outline-none"
              placeholder="Enter email"
            />
          </div>
          <span className="text-error min-h-4 pl-1 text-left text-[9px]">
            {errors.email ? "Email is required" : ""}
          </span>
        </div>

        <div className="flex flex-col gap-y-1">
          <div
            className={`group flex items-center gap-x-1.5 rounded-xl border p-2 transition-all duration-300 ${
              errors.password
                ? "border-error"
                : "border-border-light focus-within:border-main-blue"
            }`}
          >
            <span
              className={`500:text-sm text-xs transition-colors duration-300 ${
                errors.password
                  ? "text-error"
                  : "text-text-form group-focus-within:text-main-blue"
              }`}
            >
              <SlLock />
            </span>
            <input
              {...register("password", { required: true })}
              type="text"
              className="text-text-form 500:text-sm w-full bg-transparent text-xs outline-none"
              placeholder="Enter password"
            />
          </div>
          <span className="text-error min-h-4 pl-1 text-left text-[9px]">
            {errors.password ? "Password is required" : ""}
          </span>
        </div>

        <Button
          type="submit"
          className="mx-auto mt-6 w-fit tracking-wide"
          intent="login"
          size="medium"
        >
          Log In
        </Button>
      </form>

      <div className="800:flex 800:flex-row 800:items-center 800:justify-center 800:gap-x-1.5 flex flex-col items-center justify-center">
        <p className="text-main-navy-blue 500:text-base text-sm">
          Don't have an account?
        </p>
        <button
          onClick={onSwitch}
          className="500:text-base text-main-blue hover:text-main-blue-hover cursor-pointer text-sm font-medium transition-all duration-300"
        >
          Sign up!
        </button>
      </div>
    </div>
  );
}
