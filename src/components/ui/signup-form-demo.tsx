"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

export default function SignupFormDemo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle signup logic
  };
  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
        Create your account
      </h2>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
        Sign up to get started!
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <LabelInputContainer>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Jane Doe" type="text" />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="jane@example.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>
        <button
          className="w-full py-2 rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow transition hover:from-pink-600 hover:to-purple-600 dark:bg-zinc-800"
          type="submit"
        >
          Sign up &rarr;
        </button>
      </form>
      <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <div className="flex flex-col space-y-3">
        <SocialButton icon={<IconBrandGithub />} label="Sign up with GitHub" />
        <SocialButton icon={<IconBrandGoogle />} label="Sign up with Google" />
      </div>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="flex items-center gap-2 w-full py-2 px-4 rounded-md bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
      type="button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
} 