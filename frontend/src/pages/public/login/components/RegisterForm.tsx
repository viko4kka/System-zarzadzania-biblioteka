import { GoMail, GoPencil } from "react-icons/go";
import { SlLock } from "react-icons/sl";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../../ui/Button";

import { motion } from "motion/react";

type RegisterFormType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface RegisterFormProps {
  onSwitch: () => void;
}

export default function RegisterForm({ onSwitch }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>();

  const onSubmit: SubmitHandler<RegisterFormType> = (data) => console.log(data);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="my-4 flex w-full flex-col items-center justify-center"
    >
      <h1 className="500:text-2xl text-main-navy-blue 800:col-span-2 px-8 text-xl">
        Join our library!
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="500:mt-6 500:px-10 800:px-6 800:gap-y-1 my-4 flex w-full flex-col gap-y-1 px-6"
      >
        <div className="flex flex-col gap-y-1">
          <div
            className={`group flex items-center gap-x-1.5 rounded-xl border p-2 transition-all duration-300 ${
              errors.firstName
                ? "border-error"
                : "border-border-light focus-within:border-main-blue"
            }`}
          >
            <span
              className={`500:text-sm text-xs transition-colors duration-300 ${
                errors.firstName
                  ? "text-error"
                  : "text-text-form group-focus-within:text-main-blue"
              }`}
            >
              <GoPencil />
            </span>
            <input
              {...register("firstName", { required: true })}
              type="text"
              className="text-text-form 500:text-sm w-full bg-transparent text-xs outline-none"
              placeholder="Enter name"
            />
          </div>
          <span className="text-error min-h-4 pl-1 text-left text-[9px]">
            {errors.firstName ? "First name is required" : ""}
          </span>
        </div>

        <div className="flex flex-col gap-y-1">
          <div
            className={`group flex items-center gap-x-1.5 rounded-xl border p-2 transition-all duration-300 ${
              errors.lastName
                ? "border-error"
                : "border-border-light focus-within:border-main-blue"
            }`}
          >
            <span
              className={`500:text-sm text-xs transition-colors duration-300 ${
                errors.lastName
                  ? "text-error"
                  : "text-text-form group-focus-within:text-main-blue"
              }`}
            >
              <GoPencil />
            </span>
            <input
              {...register("lastName", { required: true })}
              type="text"
              className="text-text-form 500:text-sm w-full bg-transparent text-xs outline-none"
              placeholder="Enter surname"
            />
          </div>
          <span className="text-error min-h-4 pl-1 text-left text-[9px]">
            {errors.lastName ? "Last name is required" : ""}
          </span>
        </div>

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
              name="email"
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
              name="password"
              className="text-text-form 500:text-sm w-full bg-transparent text-xs outline-none"
              placeholder="Enter password"
            />
          </div>
          <span className="text-error min-h-4 pl-1 text-left text-[9px]">
            {errors.password ? "Password is required" : ""}
          </span>
        </div>

        <div className="flex flex-col gap-y-1">
          <div
            className={`group flex items-center gap-x-1.5 rounded-xl border p-2 transition-all duration-300 ${
              errors.confirmPassword
                ? "border-error"
                : "border-border-light focus-within:border-main-blue"
            }`}
          >
            <span
              className={`500:text-sm text-xs transition-colors duration-300 ${
                errors.confirmPassword
                  ? "text-error"
                  : "text-text-form group-focus-within:text-main-blue"
              }`}
            >
              <SlLock />
            </span>
            <input
              {...register("confirmPassword", { required: true })}
              type="text"
              name="confirmPassword"
              className="text-text-form 500:text-sm w-full bg-transparent text-xs outline-none"
              placeholder="Enter password again"
            />
          </div>
          <span className="text-error min-h-4 pl-1 text-left text-[9px]">
            {errors.confirmPassword ? " Confirm password is required" : ""}
          </span>
        </div>

        <Button
          type="submit"
          className="800:mt-5 mx-auto mt-3 w-fit tracking-wide"
          intent="login"
          size="medium"
        >
          Register
        </Button>
      </form>

      <div className="800:flex 800:flex-row 800:items-center 800:justify-center 800:gap-x-1.5 flex flex-col items-center justify-center">
        <p className="text-main-navy-blue 500:text-base text-sm">
          Already have an account?
        </p>
        <button
          onClick={onSwitch}
          className="500:text-base text-main-blue hover:text-main-blue-hover cursor-pointer text-sm font-medium transition-all duration-300"
        >
          Log in!
        </button>
      </div>
    </motion.div>
  );
}
