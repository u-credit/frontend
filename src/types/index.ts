export type SelectOption = {
  label: string;
  value: string | number;
  children?: SelectOption[];
};
