"use client";
import { FC, ReactNode } from "react";
import { TextProps, Typography } from "../ui/Typography";

type DynamicTextProps = {
  title?: ReactNode;
  titleProps?: Partial<TextProps>;
  description?: ReactNode;
  descriptionProps?: Partial<TextProps>;
  className?: string;
  spacing?: string;
  onClick?: () => void;
};

export const DynamicHeading: FC<DynamicTextProps> = ({
  title,
  titleProps = {},
  description,
  descriptionProps = {},
  className = "",
  spacing = "mt-2",
  onClick,
}) => {
  return (
    <div className={className} onClick={onClick}>
      {title && (
        <Typography
          as="h2"
          size="2xl"
          weight="semiBold"
          className="dark:text-foreground"
          {...titleProps}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          size="sm"
          weight="normal"
          className={`text-muted-foreground dark:text-foreground/60 ${title ? spacing : ""}`}
          {...descriptionProps}
        >
          {description}
        </Typography>
      )}
    </div>
  );
};
