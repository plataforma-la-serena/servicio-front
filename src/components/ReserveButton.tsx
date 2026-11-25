import { whatsappHref } from "@/lib/whatsapp";

interface ReserveButtonProps {
  label?: string;
  message?: string;
  className?: string;
}

const DEFAULT_MESSAGE =
  "Hola, quiero consultar por los departamentos en La Serena.";

export function ReserveButton({
  label = "Reservar",
  message = DEFAULT_MESSAGE,
  className = "",
}: ReserveButtonProps) {
  const href = whatsappHref(message);
  const isExternal = href.startsWith("http");

  return (
    <a
      className={`button ${className}`.trim()}
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {label}
    </a>
  );
}
