"use client";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { HomeIcon, ArrowLeft } from "lucide-react";
import AppButton from "@/components/common/AppButton";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="mask-b-from-20% mask-b-to-80% font-extrabold text-9xl">
            404
          </EmptyTitle>
          <EmptyDescription className="-mt-8 text-nowrap text-foreground/80">
            The page you&apos;re looking for might have been <br />
            moved or doesn&apos;t exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <AppButton
              variant="outline"
              onClick={() => router.back()}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Go Back
            </AppButton>
            <AppButton
              variant="secondary"
              className="text-muted! flex items-center gap-2"
              leftIcon={<HomeIcon className="h-4 w-4" />}
              href="/"
            >
              Go Home
            </AppButton>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default NotFound;
