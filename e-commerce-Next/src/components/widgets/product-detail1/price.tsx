import type { PriceProps } from "./types";

const Price = ({ regular, sale, currency }: PriceProps) => {
  if (!regular || !currency) return;
  const formatCurrency = (value: number, currency: string = "USD", locale: string = "en-US") => {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
  };
  return (
    <div className="flex items-center gap-2">
      {sale && <span className="text-right text-2xl font-bold text-primary">{formatCurrency(sale, currency)}</span>}
      <span className={`text-right text-2xl font-bold ${sale ? "text-muted-foreground line-through" : "text-foreground"}`}>
        {formatCurrency(regular, currency)}
      </span>
    </div>
  );
};

export { Price };
